const module_definitions = [
    {
        "uid":"3",
        "name": "ImageSplitter", 
        "cu_type": "CM", 
        "image_ref": "ref1",
        "declared_pins":[
            {
                "uid":"31", 
                "pin_type":"required", 
                "binding":"required_strong",
                "name":"image", 
                "multiplicity":"single",
                "mandatory":true,
                "data_type":"datatype2",
                "access_type":"accesstype2"
            },
            {
                "uid":"32", 
                "pin_type":"provided",
                "binding":"provided", 
                "name":"imagep1", 
                "multiplicity":"multiple",
                "mandatory":true,
                "data_type":"datatype1",
                "access_type":"accesstype1"
            },
            {
                "uid":"33", 
                "pin_type":"provided",
                "binding":"provided",  
                "name":"imagep2", 
                "multiplicity":"multiple",
                "mandatory":true,
                "data_type":"datatype1",
                "access_type":"accesstype1"
            },
            {
                "uid":"34", 
                "pin_type":"provided",
                "binding":"provided",  
                "name":"imagep3", 
                "multiplicity":"multiple",
                "mandatory":true,
                "data_type":"datatype1",
                "access_type":"accesstype1"
            },]
    },
    {
        "uid":"4",
        "name": "ImageMerger", 
        "cu_type": "CM", 
        "image_ref": "ref1",
        "declared_pins":[
            {
                "uid":"41", 
                "pin_type":"required", 
                "binding":"required_strong",
                "name":"imagerp1", 
                "multiplicity":"multiple",
                "mandatory":true,
                "data_type":"datatype2",
                "access_type":"accesstype2"
            },
            {
                "uid":"42", 
                "pin_type":"required",
                "binding":"required_strong", 
                "name":"imagerp2", 
                "multiplicity":"multiple",
                "mandatory":true,
                "data_type":"datatype1",
                "access_type":"accesstype1"
            },
            {
                "uid":"43", 
                "pin_type":"required",
                "binding":"required_strong",  
                "name":"imagerp3", 
                "multiplicity":"multiple",
                "mandatory":true,
                "data_type":"datatype1",
                "access_type":"accesstype1"
            },
            {
                "uid":"44", 
                "pin_type":"provided",
                "binding":"provided",  
                "name":"fimage", 
                "multiplicity":"single",
                "mandatory":true,
                "data_type":"datatype1",
                "access_type":"accesstype1"
            },]
    },
    {
        "uid":"5",
        "name": "ImageProcessor", 
        "cu_type": "CM", 
        "image_ref": "ref1",
        "declared_pins":[
            {
                "uid":"31", 
                "pin_type":"required", 
                "binding":"required_strong",
                "name":"imagep", 
                "multiplicity":"single",
                "mandatory":true,
                "data_type":"datatype2",
                "access_type":"accesstype2"
            },
            {
                "uid":"32", 
                "pin_type":"provided",
                "binding":"provided", 
                "name":"imagepp", 
                "multiplicity":"multiple",
                "mandatory":true,
                "data_type":"datatype1",
                "access_type":"accesstype1"
            },
        ]
    }]

    const module_uid_2_module = new Map()

    init_module()

    function init_module(){
        for(let i=0; i < module_definitions.length; i++){
            const module = module_definitions[i]            
            module_uid_2_module.set( module.uid, module)
        }
        console.log("module_uuid_2_module after_init", module_uid_2_module)
    }

    function setModuleDefinitions(modules){
        // TODO: This is a blueprint for the data returned by the Backend API
        // TODO: This function actually should call the Backend API
        for(let i=0; i < modules.length; i++){
            const module = modules[i]            
            module_uid_2_module.set( module.uid, module)
        }   
    }

    function getModuleDefinitionByID(module_uid){
        //returns undefined if module_uid not present in map
        return module_uid_2_module.get(module_uid)
    }

    export{ setModuleDefinitions, getModuleDefinitionByID}