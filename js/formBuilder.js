
/*
* These functions relies on templates defined via script tags in dom
* with id formatted as 'formbuilder-CONTROLTYPE-template'
* where CONTROLTYPE is the type of control from in JSON map
* */
function formBuilder(domNode, map){


    if(map.hasOwnProperty('order')){
        // controls not mentioned in order are not generated
        for(var i = 0; i < map.order.length; i++){
            if(!map.hasOwnProperty(map.order[i])){
                throw {
                    name: "MalformedFormDescriptor",
                    message: "No description object found for '" +  map.order[i] + "' control!",
                    toString:    function(){return this.name + ": " + this.message;}
                };
            }
            var obj = map[map.order[i]];
            $(domNode).append(prepareDomNode($(templateControl(obj)), obj));
        }
    } else {
        for (var elem in map) {
            if (map.hasOwnProperty(elem)) {
                $(domNode).append(prepareDomNode($(templateControl(map[elem])), map[elem]));
            }
        }
    }
}

// additional template modifiers
function prepareDomNode(node,obj){

    var inputNode = $(':input', node).first();
    // store path for refreshing data for this element from other element's callbacks
    inputNode.data('path', obj.path);

    // store current value on control change
    inputNode.change(function(){

        if(obj.path !== undefined) {
            var newValue = null;
            if (['radio', 'checkbox'].indexOf(obj.type) > -1) {
                newValue = inputNode.prop('checked');

                if ('radio' == obj.type){
                    // refresh data about automatically unchecked radiobuttons (if any)

                    $("input[name='"+ inputNode.attr('name')  +"']").each(function(ind, elem){
                        if(elem !== inputNode.get(0) && !$(elem).attr('checked')){
                            Data.update($(elem).data('path'), false);
                        }
                    });

                }

            } else {
                newValue = inputNode.val();
            }

            Data.update(obj.path, newValue)
        }


    });

    // set stored value
    if(obj.hasOwnProperty('path')) {
        var storedValue = Data.getValue(obj.path);
        if (storedValue !== null) {
            if (['radio', 'checkbox'].indexOf(obj.type) > -1) {
                inputNode.prop('checked', storedValue);
            } else {
                inputNode.val(storedValue);
            }
        }
    }


    if(obj.hasOwnProperty('visible') && !obj.visible){
        node.hide();
    }
    if(obj.hasOwnProperty('disabled') && obj.disabled){
        inputNode.attr('disabled','disabled');
    }
    return node;
}

// very simple templating
function templateControl(data){
    if (data.hasOwnProperty('type')) {
        var template = $('#formbuilder-' + data.type + '-template');
        if(template.length == 0)
            throw {
                name: "MissingTemplate",
                message: "No template found for '" +  data.type + "' control!",
                toString:    function(){return this.name + ": " + this.message;}
            };

        var templateStr = template.html();

        for (var d in data) {
            if (data.hasOwnProperty(d)) {
                templateStr = templateStr.split('{{' + d + '}}').join(data[d]);
            }
        }
        // clear unfilled template placeholders
        return templateStr.replace(/\{\{.*\}\}/g,'');
    }
}