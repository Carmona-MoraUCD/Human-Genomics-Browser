from django.shortcuts import render

from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser 
from rest_framework import status

# from pymongo import MongoClient
from . import pymongo_get_database

from bson.json_util import dumps,loads
import json
 
from genomics_browser_django_app_base.models import Patient_DB
from genomics_browser_django_app_base.serializers import PatientSerializer
from rest_framework.decorators import api_view

from genomics_browser_django_app_base.models import Dataset_DB
from genomics_browser_django_app_base.serializers import DatasetSerializer

from genomics_browser_django_app_base.models import Gene_DB
from genomics_browser_django_app_base.serializers import GeneSerializer

from genomics_browser_django_app_base.models import Counter_DB
from genomics_browser_django_app_base.serializers import CounterSerializer

import datetime
import re
import sys

from . import ParsedDataset

import datetime

client = pymongo_get_database.get_connection()
patient_collection = client['patients']
gene_collection = client['genes']
dataset_collection = client['datasets']
counter_collection = client['counters']

@api_view(['POST'])
def test(request):
    # POST the given data to db
    if request.method == 'POST':
        patient_data = JSONParser().parse(request)
        serial = PatientSerializer(data=patient_data)
        if serial.is_valid():
            serial.save()
            return JsonResponse(serial.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serial.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def POST_Patient_Data(request):
    # POST the given data to db
    if request.method == 'POST':
        # Try to get all the patient_data and make a dictionary
        # If the data is not properly format return error code 406
        try:
            request_Parsed = JSONParser().parse(request)
            # patient_data = {
            #     'patient_id' : request.POST.get('patient_id'),
            #     'gene_ids' : request.POST.get('gene_ids'),
            #     'gene_values' : request.POST.get('gene_values'),
            #     'dataset_id' : request.POST.get('dataset_id')
            # }
            patient_data = {
                'patient_id' : request_Parsed['patient_id'],
                'gene_ids' : request_Parsed['gene_ids'],
                'gene_values' : request_Parsed['gene_values'],
                'dataset_id' : request_Parsed['dataset_id']
            }
        except:
            return JsonResponse(status=status.HTTP_406_NOT_ACCEPTABLE)
        
        # Try to send data to collection
        # If some error happened and couldn't insert, return error code 408
        try:
            patient_collection.insert_one(patient_data)
        except:
            return JsonResponse(status=status.HTTP_408_REQUEST_TIMEOUT)

        return JsonResponse({'status':'data sent'},status=status.HTTP_201_CREATED)

@api_view(['GET'])
def test_preview(request):
    # GET the all of the patient data when there is patient_id
    all_data = Patient_DB.objects.filter()

    if request.method == 'GET':
        serial = PatientSerializer(all_data, many=True)
        return JsonResponse(serial.data, safe=False)
    return JsonResponse(status=status.HTTP_418_IM_A_TEAPOT)

@api_view(['GET'])
def GET_patientall(request):
    if request.method == 'GET':
        item = patient_collection.find({},{'patient_id':1})
        json_data = json.loads(dumps(item))
        return JsonResponse(json_data, safe=False)
        # return JsonResponse(item, safe=False)
    return JsonResponse(status=status.HTTP_418_IM_A_TEAPOT)

@api_view(['GET'])
def patientQuery(request,patientID):
    patient_data = Patient_DB.objects.get(patient_id=patientID)

    if request.method == 'GET':
        serial = PatientSerializer(patient_data)
        return JsonResponse(serial.data)
    return JsonResponse(status=status.HTTP_418_IM_A_TEAPOT)

@api_view(['GET'])
def GET_patientQuery(request,patientID):

    if request.method == 'GET':
        item = patient_collection.find_one({'patient_id':patientID})
        json_data = json.loads(dumps(item))
        return JsonResponse(json_data, safe=False)
        # return JsonResponse(item, safe=False)
    return JsonResponse(status=status.HTTP_418_IM_A_TEAPOT)

# Dataset

@api_view(['POST'])
def POST_Dataset_Data(request):
    # POST the given data to db
    if request.method == 'POST':
        # Try to get dataset and make a dictionary
        # If the data is not properly format return error code 406

        sample = None
        dataset = None
        try:
            new_dataset_counter = 0
            new_gene_counter = 0

            counter_item = counter_collection.find_one({ "name_use": "dataset_counter" })
            if(counter_item):
                    counter_interpreted = CounterSerializer(data = counter_item, many=False)
                    if counter_interpreted.is_valid():
                        json_data = counter_interpreted.data
                        new_dataset_counter = int(json_data["seq_val"])
                        temp_update_seq = new_dataset_counter + 1
                        counter_collection.update_one({ "name_use": "dataset_counter" }, { "$set": { "seq_val": temp_update_seq , "name_use": "dataset_counter" }}, upsert=False)
                    else:
                        return JsonResponse(counter_interpreted.errors, safe=False)
            else:
                new_dataset_counter = 1
                counter_collection.insert_one({ "seq_val": 2, "name_use": "dataset_counter" })

            counter_item = counter_collection.find_one({ "name_use": "gene_counter" })
            if (counter_item):
                counter_interpreted = CounterSerializer(data=counter_item, many=False)
                if counter_interpreted.is_valid():
                    json_data = counter_interpreted.data
                    new_gene_counter = int(json_data["seq_val"])
                    temp_update_seq = new_gene_counter + 1
                    counter_collection.update_one({ "name_use": "gene_counter" }, { "$set": { "seq_val": temp_update_seq, "name_use": "gene_counter" }}, upsert=False)
                else:
                    return JsonResponse(counter_interpreted.errors, safe=False)
            else:
                new_gene_counter = 1
                counter_collection.insert_one({ "seq_val": 2, "name_use": "gene_counter" })

            sample = request.POST.copy() 
            sample.clear()
            sample.update({'id': new_dataset_counter})
            in_txt = list(request.FILES.values())[0]
            name = list(request.FILES.values())[0].name
            description = request.data.get('description')
            url = request.data.get('urltoFile')

            # date_created = datetime.datetime.strptime(request.data.get('dateCreated'), '%a %b %d %Y %H:%M:%S GMT%z (%Z)').date()

            date_created = request.data.get('dateCreated')
            date_created = re.sub(r' GMT[+-]\d{4}\s*\([^)]*\)', '', date_created)
            date_created = datetime.datetime.strptime(date_created, '%a %b %d %Y %H:%M:%S').date()

            dataset = ParsedDataset.ParsedDataset(in_txt, name, description, date_created, url, new_dataset_counter)

            sample.update(dataset.get_dataset_info())

            sample = DatasetSerializer(data=sample)
               

        except:
            return JsonResponse(status=status.HTTP_406_NOT_ACCEPTABLE)
        
        # Send patient information to database
        # Returns True when patient data post successully
        def post_patient():
            try:
                patients = [dataset.get_random_patient() for _ in range(3)]
                patient_collection.insert_many(patients)
                return True
            except:
                return False

        # Try to send data to collection
        # If some error happened and couldn't insert, return error code 408

        # need to add checks to prevent duplicate dataset creation
        try:
            if sample.is_valid():
                genes = dataset.get_genes()
                # genes = GeneSerializer(data=genes)
                # if genes.is_valid():
                gene_collection.insert_many(genes)
                # else:
                    # print("could not upload ")
                    # print(genes.errors)
                    # return JsonResponse(sample.errors, status=status.HTTP_201_CREATED, safe=False)
                dataset_collection.insert_one(sample.data)
                post_patient()
                return JsonResponse({'status':'data sent'},status=status.HTTP_201_CREATED)

                #return JsonResponse(dataset_serialized.data, status=status.HTTP_201_CREATED, safe=False)
                #return JsonResponse(dataset_serialized.data, status=status.HTTP_201_CREATED, safe=False)
            else:
                print(sample.errors)
                return JsonResponse(sample.errors, status=status.HTTP_201_CREATED, safe=False)
        
        except:
            return JsonResponse(status=status.HTTP_408_REQUEST_TIMEOUT)
        
        
'''class MongoJSONEncoder(json.JSONEncoder):
    def default(self, o: Any) -> Any:
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return str(o)
        return json.JSONEncoder.default(self, o)'''

@api_view(['GET'])
def GET_datasets_all(request):
    if request.method == 'GET':
        datasets_items = dataset_collection.find({})

        #datasets_items = MongoJSONEncoder().encode(list(datasets_items)[0])
        #datasets_items = MongoJSONEncoder().encode(list(datasets_items))

        #datasets_items = json.loads( datasets_items )
        
        #return JsonResponse( json_util.dumps( datasets_items ) , safe=False)
        #return JsonResponse( datasets_items , safe=False)

        # if request.method == 'GET':
    #     item = patient_collection.find({},{'patient_id':1})
    #     json_data = json.loads(dumps(item))
    #     return JsonResponse(json_data, safe=False)

        json_data = json.loads(dumps(datasets_items))
        return JsonResponse(json_data, safe=False)

        datasets_interpreted = DatasetSerializer(data = list(datasets_items), many=True)

        if datasets_interpreted.is_valid():
            json_data = datasets_interpreted.data
            return JsonResponse(json_data, safe=False)
        else:
            return JsonResponse(datasets_interpreted.errors, safe=False)
        
        # return JsonResponse(item, safe=False)
    
    return JsonResponse(status=status.HTTP_418_IM_A_TEAPOT)

@api_view(['GET'])
def GET_datasets_query(request, dataset_id):
    if request.method == 'GET':
        dataset_item = dataset_collection.find_one({ "id": int(dataset_id) })

        datasets_interpreted = DatasetSerializer(data = dataset_item, many=False)

        if datasets_interpreted.is_valid():
            json_data = datasets_interpreted.data
            return JsonResponse(json_data, safe=False)
        else:
            return JsonResponse(datasets_interpreted.errors, safe=False)
        
        # return JsonResponse(item, safe=False)
    
    return JsonResponse(status=status.HTTP_418_IM_A_TEAPOT)

# Gene

@api_view(['POST'])
def POST_Gene_Data(request):
    # POST the given data to db
    if request.method == 'POST':
        # Try to get dataset and make a dictionary
        # If the data is not properly format return error code 406

        updated_request = request.POST.copy()

        gene_serialized = None

        try:
            #request_Parsed = request.data
            request_Parsed = updated_request

            # find next id
            new_counter_seq = 0
            counter_item = counter_collection.find_one({ "name_use": "gene_counter" })

            if( counter_item ):
                    counter_interpreted = CounterSerializer(data = counter_item, many=False)

                    if counter_interpreted.is_valid():
                        json_data = counter_interpreted.data
                        new_counter_seq = int(json_data["seq_val"])
                        temp_update_seq = new_counter_seq + 1
                        counter_collection.update_one( {"name_use": "gene_counter" }, {"$set": {"seq_val" : temp_update_seq , "name_use":"gene_counter" } }, upsert=False )
                    else:
                        return JsonResponse(counter_interpreted.errors, safe=False)

            else:
                # need to create a counter for gene
                new_counter_seq = 1
                counter_collection.insert_one( { "seq_val" : 2 , "name_use" : "gene_counter" } )

            request_Parsed.update({'id': new_counter_seq})

            gene_serialized = GeneSerializer(data = request_Parsed)

        except:
            return JsonResponse(status=status.HTTP_406_NOT_ACCEPTABLE)
        
        # Try to send data to collection
        # If some error happened and couldn't insert, return error code 408

        # need to add checks to prevent duplicate dataset creation
        try:
            
            if gene_serialized.is_valid():
                gene_collection.insert_one(gene_serialized.data)

                return JsonResponse({'status':'data sent'},status=status.HTTP_201_CREATED)
            else:
                return JsonResponse(gene_serialized.errors, status=status.HTTP_201_CREATED, safe=False)
            
        except:
            return JsonResponse(status=status.HTTP_408_REQUEST_TIMEOUT)


@api_view(['GET'])
def GET_gene_all(request):
    if request.method == 'GET':
        gene_items = gene_collection.find({},{'name':1, 'id':1})
        json_data = json.loads(dumps(gene_items))
        return JsonResponse(json_data, safe=False) 

        # genes_serialized = GeneSerializer( data = list(gene_items), many=True)

        # if genes_serialized.is_valid():
        #     return JsonResponse(genes_serialized.data, safe=False) 
        # else:
        #     return JsonResponse(genes_serialized.errors, safe=False)
   
    return JsonResponse(status=status.HTTP_418_IM_A_TEAPOT)

@api_view(['GET'])
def GET_gene_query(request, gene_name , gene_id):
    if request.method == 'GET':
        # Maybe name and not id
        gene_item = gene_collection.find_one({"id": int(gene_id),"name":str(gene_name) })

        genes_interpreted = GeneSerializer(data = gene_item, many=False)

        if genes_interpreted.is_valid():
            json_data = genes_interpreted.data
            json_data['patient_ids'] = json.loads(json_data['patient_ids'])
            json_data['gene_values'] = json.loads(json_data['gene_values'])
            print(json_data)
            return JsonResponse(json_data, safe=False)
        else:
            return JsonResponse(genes_interpreted.errors, safe=False)
        
        # return JsonResponse(item, safe=False)
    
    return JsonResponse(status=status.HTTP_418_IM_A_TEAPOT)

# counter

@api_view(['GET'])
def GET_counter_all(request):
    if request.method == 'GET':
        counter_items = counter_collection.find({})
        counter_serialized = CounterSerializer( data = list(counter_items), many=True)
        if counter_serialized.is_valid():
            return JsonResponse(counter_serialized.data, safe=False) 
        else:
            return JsonResponse(counter_serialized.errors, safe=False)
   
    return JsonResponse(status=status.HTTP_418_IM_A_TEAPOT)

@api_view(['GET'])
def GET_patients_info(request,gene_id,dataset_id):
    if request.method == 'GET':
        patient_items = patient_collection.find({"$and": [{"gene_ids": gene_id},{"dataset_id": int(dataset_id)}]}, {"gene_ids":0,"dataset_id":0})
        json_data = json.loads(dumps(patient_items))
        return JsonResponse(json_data, safe=False) 
    
    return JsonResponse(status=status.HTTP_418_IM_A_TEAPOT)