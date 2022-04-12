import requests

#box_id must be str
def create_box_with_compartments(diagram_id, box_id):
    # POST
    # http://185.23.162.184:3000/editor/element
    
    json = [
        {
        "_id":box_id,
        "diagramId":diagram_id,
        "elementTypeId":"RequiredDataPin",
        "type":0,
        "style":{
            "elementStyle":{
                "fill":"white",
                "opacity":1,
                "stroke":"#000000",
                "strokeWidth":1,
                "shape":"ComputedDataPinSingle",
                "perfectDrawEnabled":False,
                "data":"M20,0 L90,45 L20,90 Z",
                "lineJoin":"round"
            }
        },
        "compartments":[
            {
                "id":box_id + "1","input":"Required Data Pin","value":"Required Data Pin",
                "style":{
                    "align":"center",
                    "fill":"#000000",
                    "fontFamily":"Arial",
                    "fontSize":14,
                    "fontStyle":"bold",
                    "fontVariant":"normal",
                    "strokeWidth":1,
                    "visible":True,
                    "y":0,
                    "text":"Required Data Pin",
                    "listening":False,
                    "perfectDrawEnabled":False,
                    "width":"auto",
                    "height":"auto"
                }
            }
            ,
            {
                "id":box_id + "2",
                "input":"15857686409281",
                "value":"15857686409281",
                "style":{"align":"center","fill":"#000000","fontFamily":"Arial","fontSize":14,"fontStyle":"bold","fontVariant":"normal","strokeWidth":1,"visible":False,"y":0,"text":"","listening":False,"perfectDrawEnabled":False,"width":"auto","height":"auto"}
            }
            ,
            {
                "id":box_id + "3",
                "input":"15857686409282",
                "value":"15857686409282",
                "style":{"align":"center","fill":"#000000","fontFamily":"Arial","fontSize":14,"fontStyle":"bold","fontVariant":"normal","strokeWidth":1,"visible":False,"y":0,"text":"","listening":False,"perfectDrawEnabled":False,"width":"auto","height":"auto"}
            },
            {
                "id":box_id + "4",
                "input":"15857686409283",
                "value":"15857686409283",
                "style":{"align":"center","fill":"#000000","fontFamily":"Arial","fontSize":14,"fontStyle":"bold","fontVariant":"normal","strokeWidth":1,"visible":False,"y":0,"text":"","listening":False,"perfectDrawEnabled":False,"width":"auto","height":"auto"}
            },
            {
                "id":box_id + "5",
                "input":True,
                "value":True,
                "style":{"align":"center","fill":"#000000","fontFamily":"Arial","fontSize":14,"fontStyle":"bold","fontVariant":"normal","strokeWidth":1,"visible":False,"y":0,"text":"","listening":False,"perfectDrawEnabled":False,"width":"auto","height":"auto"}
            }
            ],
            "location":{"x":394,"y":51,"width":100,"height":100}}
    ]

    x = requests.post("http://185.23.162.184:3000/editor/element",json=json)
    print(x.text)
    print(x.raw)

def create_diagram():
    # POST 
    # http://185.23.162.184:3000/editor/diagram
    # {name: "diagram1"}
    
    url = 'http://185.23.162.184:3000/editor/diagram'
    myobj = {'name': "diagram1"}

    x = requests.post(url,json=myobj)

    diagram_id = x.text
    print("Created diagram " + diagram_id)
    return diagram_id


def main():
    diagram_id = create_diagram()
    # diagram_id = "3e442f61bc024f609c26543768e8af19"
    create_box_with_compartments(diagram_id, "123")
    create_box_with_compartments(diagram_id, "1234")
    # get_diagram_elements(diagram_id)

main()