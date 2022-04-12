import { mymixin } from '../mixins/mixins.js'
// eslint-disable-next-line no-unused-vars
import { _ } from 'vue-underscore';
import utils from '../../utils/utils'
import axios from '../../utils/axios'

export default {
    mixins:[mymixin, utils],

    mounted: function() {
        this.getDataSets();
        this.getDataTypes();
        this.getDataStructures();
        this.getAccessTypes();
    },

    data: function() {
        return {
            // This will hold information to display in the main page content and in dropdowns
            dataSets: [],
            dataTypes: [],
            dataStructures: [],
            accessTypes: [],
            // Data holders for data set creation window
            createDataSetName: "",
            createDataSetMultiplicityChecked: false,
            createDataSetSelectedDataType: null,
            createDataSetSelectedDataStructure: null,
            createDataSetSelectedAccessType: null,
            createDataSetAccessSchemaModel: {},
            createDataSetPathSchemaModel: {},
            createDataSetStructuredDataSchemaModel: {},
            createDataSetClearDataStructureFlag: false,
            createDataSetClearSchemasFlag: false,
            createDataSetClearDataStructureSchemaFlag: false,
            // Data holders for data set editing window
            editDataSetName: "",
            editDataSetMultiplicityChecked: false,
            editDataSetSelectedDataType: null,
            editDataSetSelectedDataStructure: null,
            editDataSetSelectedAccessType: null,
            editDataSetAccessSchemaModel: {},
            editDataSetPathSchemaModel: {},
            editDataSetStructuredDataSchemaModel: {},
            editDataSetClearDataStructureFlag: false,
            editDataSetClearSchemasFlag: false,
            editDataSetClearDataStructureSchemaFlag: false,

            currDataSet:null,
        }
    },

    watch: {  // These functions can get parameters (val) or (oldval, val) 
        createDataSetSelectedAccessType: function () {
            if (this.createDataSetClearSchemasFlag) {
                this.createDataSetAccessSchemaModel = {}
                this.createDataSetPathSchemaModel = {}
                
            } 
            
            this.createDataSetClearSchemasFlag = true
        },
        createDataSetSelectedDataType: function () {
            if (this.createDataSetClearDataStructureFlag) {
                this.createDataSetSelectedDataStructure = null
                this.createDataSetStructuredDataSchemaModel = {}
            }

            if (this.createDataSetSelectedDataType && this.createDataSetSelectedDataType.name=="DirectData") {
                this.createDataSetAccessSchemaModel = {}
                this.createDataSetPathSchemaModel = {}
                this.createDataSetSelectedAccessType = null

                this.createDataSetClearSchemasFlag = true
            }

            this.createDataSetClearDataStructureFlag = true
        },
        createDataSetSelectedDataStructure: function () {
            if (this.createDataSetClearDataStructureSchemaFlag) { 
                this.createDataSetStructuredDataSchemaModel = {}
            }

            this.createDataSetClearDataStructureSchemaFlag = true
        },
        editDataSetSelectedAccessType: function () {
            if (this.editDataSetClearSchemasFlag) {
                this.editDataSetAccessSchemaModel = {}
                this.editDataSetPathSchemaModel = {}
                
            }

            this.editDataSetClearSchemasFlag = true
        },
        editDataSetSelectedDataType: function () {
            if (this.editDataSetClearDataStructureFlag) {
                this.editDataSetSelectedDataStructure = null
                this.editDataSetStructuredDataSchemaModel = {}
            }

            if (this.editDataSetSelectedDataType && this.editDataSetSelectedDataType.name=="DirectData") {
                this.editDataSetAccessSchemaModel = {}
                this.editDataSetPathSchemaModel = {}
                this.editDataSetSelectedAccessType = null

                this.editDataSetClearSchemasFlag = true
            }
            
            this.editDataSetClearDataStructureFlag = true
        },
        editDataSetSelectedDataStructure: function () {
            if (this.editDataSetClearDataStructureSchemaFlag) { 
                this.editDataSetStructuredDataSchemaModel = {}
            }

            this.editDataSetClearDataStructureSchemaFlag = true
        }
    },

    methods: {
        // Functions regarding DataSets
        getDataSets: function() {
            var self = this;

            var backend = this.SERVER_URL();

            axios.get(backend + "task/dataShelf")
                    .then(response => {
                        if (self.noErrorsInResponse(response)) {
                            self.dataSets = self.processResponse(response).data;
                        }
                    })
                    .catch(error => {
                        self.processErrorInPromise(error)
                    })
        },
        // eslint-disable-next-line no-unused-vars
        createNewDataSet: function(ev) {
            var self = this;

            var list = {
                "name": self.createDataSetName,

                "dataTypeUid": self.createDataSetSelectedDataType ? self.createDataSetSelectedDataType.uid : null,
                "dataTypeName": self.createDataSetSelectedDataType ? self.createDataSetSelectedDataType.name : null,
                "dataTypeVersion": self.createDataSetSelectedDataType ? self.createDataSetSelectedDataType.version : null,

                "multiplicity": self.createDataSetMultiplicityChecked ? 1 : 0,

                "dataStructureUid": self.createDataSetSelectedDataStructure ? self.createDataSetSelectedDataStructure.uid : null,
                "dataStructureName": self.createDataSetSelectedDataStructure ? self.createDataSetSelectedDataStructure.name : null,
                "dataStructureVersion": self.createDataSetSelectedDataStructure ? self.createDataSetSelectedDataStructure.version : null,

                "accessTypeUid": self.createDataSetSelectedAccessType ? self.createDataSetSelectedAccessType.uid : null,
                "accessTypeName": self.createDataSetSelectedAccessType ? self.createDataSetSelectedAccessType.name : null,
                "accessTypeVersion": self.createDataSetSelectedAccessType ? self.createDataSetSelectedAccessType.version : null,

                "values": !self.createDataSetSelectedDataType || self.createDataSetSelectedDataType.name!="DirectData" ? 
                          JSON.stringify(self.createDataSetPathSchemaModel, null, '\t') :
                          JSON.stringify(self.createDataSetStructuredDataSchemaModel, null, '\t'),  // We can also do (model) or (model, null, '\n')
                "accessValues": JSON.stringify(self.createDataSetAccessSchemaModel, null, '\t')
            }

            var backend = this.SERVER_URL();

            // var backend = "http://185.23.162.184:443/";  // What does this reference?

            axios.put(backend + "task/dataSet", list)
                    .then(response => {
                        if (self.noErrorsInResponse(response)) {
                            self.getDataSets();
                        }
                    });

            this.clearCreateWindow();
        },

        deleteDataSet: function(ev) {
            var self = this;

            var data_set_id = $(ev.target).closest(".data_set").attr("id");

            var backend = this.SERVER_URL();
            
            axios.delete(backend + "task/dataSet?dataSetUid=" + data_set_id)
                    .then(response => {
                        if (self.noErrorsInResponse(response)) {
                            self.getDataSets();
                        }
                    })
                    .catch(error => {
                        self.processErrorInPromise(error)
                    });
        },
        
        deleteCurrDataSet(){
            if( ! this.currDataSet ){
                return;
            }
            
            const self = this;
            
            axios.delete(this.SERVER_URL() + "task/dataSet?dataSetUid=" + this.currDataSet.uid)
                .then(response => {
                    if (self.noErrorsInResponse(response)) {
                        self.getDataSets();
                    }
                    self.addNotification("Dataset " + self.currDataSet.name + " delete succeeded.", "info");
                })
                .catch(error => {
                    self.processErrorInPromise(error)
                });
        },

        editDataSet: function(ev) {
            var self = this;

            var list = {
                "uid": $(ev.target).closest(".data_set").attr("id"),

                "name": self.editDataSetName,

                "dataTypeUid": self.editDataSetSelectedDataType ? self.editDataSetSelectedDataType.uid : null,
                "dataTypeName": self.editDataSetSelectedDataType ? self.editDataSetSelectedDataType.name : null,
                "dataTypeVersion": self.editDataSetSelectedDataType ? self.editDataSetSelectedDataType.version : null,

                "multiplicity": self.editDataSetMultiplicityChecked ? 1 : 0,

                "dataStructureUid": self.editDataSetSelectedDataStructure ? self.editDataSetSelectedDataStructure.uid : null,
                "dataStructureName": self.editDataSetSelectedDataStructure ? self.editDataSetSelectedDataStructure.name : null,
                "dataStructureVersion": self.editDataSetSelectedDataStructure ? self.editDataSetSelectedDataStructure.version : null,

                "accessTypeUid": self.editDataSetSelectedAccessType ? self.editDataSetSelectedAccessType.uid : null,
                "accessTypeName": self.editDataSetSelectedAccessType ? self.editDataSetSelectedAccessType.name : null,
                "accessTypeVersion": self.editDataSetSelectedAccessType ? self.editDataSetSelectedAccessType.version : null,

                "values": !self.editDataSetSelectedDataType || self.editDataSetSelectedDataType.name!="DirectData" ? 
                JSON.stringify(self.editDataSetPathSchemaModel, null, '\t') :
                JSON.stringify(self.editDataSetStructuredDataSchemaModel, null, '\t'),  // We can also do (model) or (model, null, '\n')
                "accessValues": JSON.stringify(self.editDataSetAccessSchemaModel, null, '\t')
            };

            var backend = this.SERVER_URL();

            axios.post(backend + "task/dataSet", list)
                    .then(response => {
                        if (self.noErrorsInResponse(response)) {
                            self.getDataSets();
                        }
                    })
                    .catch(error => {
                        self.processErrorInPromise(error)
                    });

            this.clearEditWindow();  // We need this so the model clears correctly (and doesn't accidentally keep wrong information as well) 
        },

        // Functions regarding DataTypes
        getDataTypes: function() {
            var self = this;

            var backend = this.SERVER_URL();

            axios.get(backend + "task/dataTypes")
                    .then(response => {
                        if (self.noErrorsInResponse(response)) {
                            self.dataTypes = self.processResponse(response).data;
                        }
                    })
                    .catch(error => {
                        self.processErrorInPromise(error)
                    })
        },

        // Functions regarding DataStructures
        getDataStructures: function() {
            var self = this;

            var backend = this.SERVER_URL();

            axios.get(backend + "task/dataStructures")
                    .then(response => {
                        if (self.noErrorsInResponse(response)) {
                            self.dataStructures = self.processResponse(response).data;
                        }
                    })
                    .catch(error => {
                        self.processErrorInPromise(error)
                    })
        },

        // Functions regarding AccessTypes
        getAccessTypes: function() {
            var self = this;

            var backend = this.SERVER_URL();

            axios.get(backend + "task/accessTypes")
                    .then(response => {
                        if (self.noErrorsInResponse(response)) {
                            self.accessTypes = self.processResponse(response).data;
                        }
                    })
                    .catch(error => {
                        self.processErrorInPromise(error)
                    })
        },

        // Functions regarding generated schemas
        capitalizeString: function(text) {
            return text.charAt(0).toUpperCase() + text.slice(1);
        },
        
        getSchemaFromJSONString: function(schema) {
            try {
                return JSON.parse(schema);
            }
            catch (err) {
                return {};
            }
        },

        getSchema: function(schema) {
            return this.getSchemaFromJSONString(schema);
        },

        getUISchema: function(schema) {
            var generatedUiSchema = [] // uiSchema is an array of objects

            var props = this.getSchemaFromJSONString(schema);

            // For each key we create an object an add it to the array
            for (var key of Object.keys(props)) {  // Currently we haven't implemented much exception handling (don't know if we need to)
                var lowerCaseName = key;

                var upperCaseName = this.capitalizeString(lowerCaseName)
                // var upperCaseName = props[key].title;

                var fieldType = props[key].type;

                var inputAttrs = fieldType == "integer" ? 
                {
                    "id": lowerCaseName,  // Could ID accidentally be duplicate here? (imo yes, but i don't think it would break because of it)
                    "type": "number",
                    "min": 0
                }
                :
                {
                    "for": lowerCaseName
                };

                var field = {
                    "component": "div",
                    "fieldOptions": {
                        "class": [
                            "form-group"
                        ]
                    },
                    "children": [
                        {
                            "component": "label",
                            "fieldOptions": {
                                "attrs": {
                                    "for": lowerCaseName
                                },
                                "class": [
                                    "col-form-label"
                                ],
                                "domProps": {
                                    "innerHTML": upperCaseName
                                }
                            }
                        },
                        {
                            "component": "input",
                            "model": lowerCaseName,  // This references to properties in schema, right? Or not because of the modal stuff
                            "fieldOptions": {
                                "attrs": inputAttrs,
                                "class": [
                                    "form-control"
                                ],
                                "on": [
                                    "input"
                                ]
                            }
                        }
                    ]
                }
                generatedUiSchema.push(field);
            }

            return generatedUiSchema;
        },

        fillCreateWindow: function(selected_data_set) {
            // Setting data set name
            this.createDataSetName = selected_data_set.name;

            // Setting data set multiplicity
            this.createDataSetMultiplicityChecked = selected_data_set.multiplicity == 1;

            // Code that allows us to set data structure initially and change it to null every other change
            this.createDataSetClearDataStructureFlag = false;

            // Setting data set type
            var dataType = this.dataTypes.filter((obj)=>{ return obj.uid === selected_data_set.dataTypeUid; }).pop();  // If this doesn't find a match, it will be undefined
            if (dataType == undefined) dataType = null;  // theoretically undefined==null, but for safety measures we can do this (if we don't, then we can do this in 1 line instead of 3)
            this.createDataSetSelectedDataType = dataType

            this.createDataSetClearDataStructureSchemaFlag = false;
            
            // Setting data set structure
            var dataStructure = this.dataStructures.filter((obj)=>{ return obj.uid === selected_data_set.dataStructureUid; }).pop();
            if (dataStructure == undefined) dataStructure = null;
            this.createDataSetSelectedDataStructure = dataStructure

            var dataSchemaModel = {};
            
            if (dataType && dataType.name=="DirectData" && dataStructure) {
                var createDataStructureSchemaModel = this.getSchemaFromJSONString(selected_data_set.values);

                var dataSchema = this.getSchemaFromJSONString(dataStructure.dataSchema);

                for (var key of Object.keys(createDataStructureSchemaModel)) {
                    if (Object.keys(dataSchema).includes(key)) {
                        dataSchemaModel[key] = createDataStructureSchemaModel[key];
                    }
                }
            }

            this.createDataSetStructuredDataSchemaModel = dataSchemaModel;

            // Code that correctly sets the generated values for access type schema models
            // This will control so that edit window has correct model values when changing access type
            this.createDataSetClearSchemasFlag = false;

            // Setting access type
            var accessType = this.accessTypes.filter((obj)=>{ return obj.uid === selected_data_set.accessTypeUid; }).pop();
            if (accessType == undefined) accessType = null;
            this.createDataSetSelectedAccessType = accessType
            
            // Setting the generated model default values
            var accessSchemaModel = {};
            var pathSchemaModel = {};
            if (accessType) {  // If it's null -> empty brackets, else we need model values
                var createPathSchemaModel = this.getSchemaFromJSONString(selected_data_set.values);

                var createAccessSchemaModel = this.getSchemaFromJSONString(selected_data_set.accessValues);

                var accessSchema = this.getSchemaFromJSONString(accessType.accessSchema);  // From this we will find out all possible keys AccessSchema can have

                var pathSchema = this.getSchemaFromJSONString(accessType.pathSchema);  // From this we will find out all possible keys PathSchema can have
                
                for (var key of Object.keys(createPathSchemaModel)) {
                    if (Object.keys(pathSchema).includes(key)) {
                        pathSchemaModel[key] = createPathSchemaModel[key];
                    }
                }

                for (var key of Object.keys(createAccessSchemaModel)) {
                    if (Object.keys(accessSchema).includes(key)) {
                        accessSchemaModel[key] = createAccessSchemaModel[key];
                    }
                }
            }
            this.createDataSetAccessSchemaModel = accessSchemaModel;
            this.createDataSetPathSchemaModel = pathSchemaModel;
        },

        fillEditWindow: function(selected_data_set) {
            // Setting data set name
            this.editDataSetName = selected_data_set.name;

            // Setting data set multiplicity
            this.editDataSetMultiplicityChecked = selected_data_set.multiplicity == 1;

            // Code that allows us to set data structure initially and change it to null every other change
            this.editDataSetClearDataStructureFlag = false;

            // Setting data set type
            var dataType = this.dataTypes.filter((obj)=>{ return obj.uid === selected_data_set.dataTypeUid; }).pop();  // If this doesn't find a match, it will be undefined
            if (dataType == undefined) dataType = null;  // theoretically undefined==null, but for safety measures we can do this (if we don't, then we can do this in 1 line instead of 3)
            this.editDataSetSelectedDataType = dataType

            this.editDataSetClearDataStructureSchemaFlag = false;

            // Setting data set structure
            var dataStructure = this.dataStructures.filter((obj)=>{ return obj.uid === selected_data_set.dataStructureUid; }).pop();
            if (dataStructure == undefined) dataStructure = null;
            this.editDataSetSelectedDataStructure = dataStructure

            var dataSchemaModel = {};
            
            if (dataType && dataType.name=="DirectData" && dataStructure) {
                var editDataStructureSchemaModel = this.getSchemaFromJSONString(selected_data_set.values);

                var dataSchema = this.getSchemaFromJSONString(dataStructure.dataSchema);

                for (var key of Object.keys(editDataStructureSchemaModel)) {
                    if (Object.keys(dataSchema).includes(key)) {
                        dataSchemaModel[key] = editDataStructureSchemaModel[key];
                    }
                }
            }

            this.editDataSetStructuredDataSchemaModel = dataSchemaModel;

            // Code that correctly sets the generated values for access type schema models
            // This will control so that edit window has correct model values when changing access type
            this.editDataSetClearSchemasFlag = false;

            // Setting access type
            var accessType = this.accessTypes.filter((obj)=>{ return obj.uid === selected_data_set.accessTypeUid; }).pop();
            if (accessType == undefined) accessType = null;
            this.editDataSetSelectedAccessType = accessType
            
            // Setting the generated model default values
            var accessSchemaModel = {};
            var pathSchemaModel = {};
            if (accessType) {  // If it's null -> empty brackets, else we need model values
                var editPathSchemaModel = this.getSchemaFromJSONString(selected_data_set.values);

                var editAccessSchemaModel = this.getSchemaFromJSONString(selected_data_set.accessValues);

                var accessSchema = this.getSchemaFromJSONString(accessType.accessSchema);  // From this we will find out all possible keys AccessSchema can have

                var pathSchema = this.getSchemaFromJSONString(accessType.pathSchema);  // From this we will find out all possible keys PathSchema can have
                
                for (var key of Object.keys(editPathSchemaModel)) {
                    if (Object.keys(pathSchema).includes(key)) {
                        pathSchemaModel[key] = editPathSchemaModel[key];
                    }
                }

                for (var key of Object.keys(editAccessSchemaModel)) {
                    if (Object.keys(accessSchema).includes(key)) {
                        accessSchemaModel[key] = editAccessSchemaModel[key];
                    }
                }
            }
            this.editDataSetAccessSchemaModel = accessSchemaModel;
            this.editDataSetPathSchemaModel = pathSchemaModel;
        },

        clearCreateWindow: function() {
            this.createDataSetName = "";
            this.createDataSetMultiplicityChecked = false;
            this.createDataSetSelectedDataType = null;
            this.createDataSetSelectedDataStructure = null;
            this.createDataSetSelectedAccessType = null;
            this.createDataSetAccessSchemaModel = {};
            this.createDataSetPathSchemaModel = {};
            this.createDataSetStructuredDataSchemaModel = {};
        },

        clearEditWindow: function() {
            this.editDataSetName = "";
            this.editDataSetMultiplicityChecked = false;
            this.editDataSetSelectedDataType = null;
            this.editDataSetSelectedDataStructure = null;
            this.editDataSetSelectedAccessType = null;
            this.editDataSetAccessSchemaModel = {};
            this.editDataSetPathSchemaModel = {};
            this.editDataSetStructuredDataSchemaModel = {};
            this.clearModalMessage();
        }
    }
}
