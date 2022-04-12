import { mymixin } from '../../mixins/mixins.js'
import { _ } from 'vue-underscore'
import utils from '../../../utils/utils'
import blsc_axios from '../../../utils/axios'
// import { AvatarPlugin } from 'bootstrap-vue'

export default {
    components: {
        
    },
    mixins:[mymixin, utils],
    mounted: function() {
        this.loadTypes();
    },
    data () {
        return {
            dataField: '',
            id:0,
            pins:[],
            

            dataTypes:[],
            dataStructures:[],
            accessTypes:[],

            selectedDataType: "",
            selectedDataStructure: "",
            selectedAccessType: "",
            isPinNameValid:true,
        }
    },
    methods: {
        
        init_types_lists:function(response_dataTypes,response_accessTypes,response_dataStructures){
            var self = this;
            if (self.noErrorsInResponse(response_dataTypes) && 
                self.noErrorsInResponse(response_accessTypes) && 
                self.noErrorsInResponse(response_dataStructures)
            ) 
            {
              this.dataTypes = _.sortBy(_.map(response_dataTypes.data.data, function(dt) {
                return {
                  name: dt.name + " (" + dt.version + ")",
                  uid: dt.uid,
                  isStructured: dt.isStructured,
                }
              }), function(dt) {
                return dt.name
              });
          
              this.accessTypes = _.sortBy(_.map(response_accessTypes.data.data, function(at) {
                return {
                  name: at.name + " (" + at.version + ")",
                  uid: at.uid,
                }
              }), function(at) {
                return at.name
              });
              this.dataStructures = _.sortBy(response_dataStructures.data.data, function(ds) { return ds.name});
            }
        },

        loadTypes:function(){
            var self = this;
            this.isLoading = true;
            const backend = this.SERVER_URL();
            const request_datatypes = blsc_axios.get(backend + "task/dataTypes");
            const request_accesstypes = blsc_axios.get(backend + "task/accessTypes");
            const request_datastructures = blsc_axios.get(backend + "task/dataStructures");

            Promise
            .all([request_datatypes, request_accesstypes, request_datastructures])
            .then((responses) => {
                var responses_good = true;
                _.each(responses, function(resp) {
                    responses_good = self.noErrorsInResponse(resp) && responses_good
                });
                if (responses_good) {
                    self.init_types_lists( responses[0], responses[1], responses[2]);
                    self.isLoading = false;
                }
            })
            .catch(error => {
                self.processErrorInPromise(error)
                self.isLoading = false;
            });
    
        },

        shouldDataStructureBeVisible(){
            //find datatype in a list of datatypes by selectedDataType; variable selectedDataType contains id of a datatType 
            let selectedDataType_loc = null;
            for(let i=0; i < this.dataTypes.length; i++){
                if(this.dataTypes[i].uid == this.selectedDataType ){
                    selectedDataType_loc = this.dataTypes[i];
                    break;
                }
            }
            //console.log("shouldDataStructureBeVisible returning " , selectedDataType_loc && selectedDataType_loc.isStructured)
            if(selectedDataType_loc && selectedDataType_loc.isStructured){
                return true;
            }else{
                //if the new data type is set to the one that is not structured data structure should not be visible 
                //and previsously selested value is set to ""
                this.selectedDataStructure = "";
                return false;
            }
            
        },

        setCreateDeclaredPinFormControlsToDefaultValues:function(){
            console.log("showAddPinModal")
             // console.log("prm",aaaa)
            // console.log("Button test")
            // console.log(event.target);
            // let apprel = document.getElementById("createAppRelease")//.modal('show');
            // console.log("apprel",apprel)
            // console.log(this.currAppId)
            //this.currAppId = app_uid
            //console.log(this.currAppId)
            //this.validateRelease = false
            //this.releaseName = ""

            document.getElementById("pin_name_id").value = ""
            let binding_elements = document.getElementsByName('binding');
            
            // console.log(binding_elements);
            // binding_elements.forEach(e => {
            //     e.checked = false
            // });
            binding_elements[0].checked = true;

            
            let multiplicity_elements = document.getElementsByName('multiplicity');
            
            // console.log(multiplicity_elements);
            // multiplicity_elements.forEach(e => {
            //     e.checked = false
            // });
            multiplicity_elements[0].checked = true;
            
            let data_multiplicity_elements = document.getElementsByName('dataMultiplicity');
            
            // console.log(multiplicity_elements);
            // multiplicity_elements.forEach(e => {
            //     e.checked = false
            // });
            data_multiplicity_elements[0].checked = true;

            this.selectedDataType = "";
            this.selectedAccessType = "";
            this.selectedDataStructure = "";

            this.isPinNameValid = true;
        },


        createDeclaredPin:function(){
            console.log("createDeclaredPin()")
            console.log()
            let name = document.getElementById("pin_name_id").value
            //check pin name 
            //if it is empty set focus on pin name input and do not create pin and show message "pin should not be empty"
            let nameOk = name && name.length > 0;
            if(! nameOk ){
                this.isPinNameValid = false;
                document.getElementById("pin_name_id").focus();
                return;
            } 
            
            let binding = null
            let binding_elements = document.getElementsByName('binding');
            
            console.log(binding_elements);
            binding_elements.forEach(e => {
                if (e.checked) {
                    binding = e.value;
                }
            });
            
            let multiplicity = null
            let multiplicity_elements = document.getElementsByName('multiplicity');
            
            console.log(multiplicity_elements);
            multiplicity_elements.forEach(e => {
                if (e.checked) {
                    multiplicity = e.value;
                }
            });

            let dataMultiplicity = null
            let data_multiplicity_elements = document.getElementsByName('dataMultiplicity');
            
            console.log(data_multiplicity_elements);
            data_multiplicity_elements.forEach(e => {
                if (e.checked) {
                    dataMultiplicity = e.value;
                }
            });

            let new_pin = {
                name: name,
                binding: binding,
                tokenMultiplicity: multiplicity,
                dataMultiplicity: dataMultiplicity,

                dataTypeUid:this.selectedDataType,
                dataStructureUid:this.selectedDataStructure,
                accessTypeUid:this.selectedAccessType,
            }
            console.log(new_pin)
            this.pins.push(new_pin)
            



            this.setCreateDeclaredPinFormControlsToDefaultValues();
            //hide form 
            $("#createDeclaredPin").modal('hide');
        },

        bindingKindString:function(val){
            val = val.toString();
            switch(val){
                case "0": return "Required-Strong";
                case "1": return "Required-Weak";
                case "2": return "Provided";
            }
            return "UnknownBinding " + val;
        },

        multiplicityKindString:function(val){
            val = val.toString();
            switch(val){
                case "0": return "Single";
                case "1": return "Multiple";
            }
            return "UnknownMultiplicity " + val;
            
        },
        
        getNameFromUid:function(array, elem_uid){
            if(array && elem_uid){
                for(let i=0; i < array.length; i++){
                    if(array[i].uid === elem_uid){
                        return array[i].name;
                    }
                }
            }
            return "";
        },

        getDataTypeNameById:function(dataTypeUid){
            return this.getNameFromUid(this.dataTypes,dataTypeUid);
        },

        getDataStructureNameById:function(dataStructureUid){
            return this.getNameFromUid(this.dataStructures, dataStructureUid);
        },

        getDataAccessTypeNameById:function(accessTypeUid){
            return this.getNameFromUid(this.accessTypes, accessTypeUid);
        },

        showAddPinModal(){
            console.log("add pin modal")
            var inner_modal = $("#createDeclaredPin");
            //inner_modal.modal('show');
            inner_modal.modal({backdrop: "static"});

            var $m1 = $('#create-module-release');
            //var $innermodal = $m1.find(".modal");     //get reference to nested modal
            $m1.after(inner_modal); 
        },

        addPin(){
            this.id += 1;
            this.pins.push({ id : this.id})
            console.log("addPin");
        }
    }
}