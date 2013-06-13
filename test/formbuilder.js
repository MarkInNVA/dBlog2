dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dojo.dom");
function buildForm() {
    var form = new dijit.form.Form({
        encType: 'multipart/form-data',
        action: '',
        method: '',
        onSubmit: function(event) { 
            if (this.validate()) {
         //       console.dir(event);
                return confirm('Form is valid, press OK to submit');
            } else {
                alert('Form contains invalid data.  Please correct first');
                return false;
            }
        }
    }, dojo.doc.createElement('div'));
    
    var textbox = new dijit.form.ValidationTextBox({
    	id: "tb",
        name: 'someName',
        required: true,
        type: 'text',
        trim: true,
        label: "Input",
        value: "Hello"
    }, dojo.doc.createElement('input'));
    
    var submitbtn = new dijit.form.Button({
        onClick:function(){
        	var t = dojo.dom.byId("tb");
        	console.log(t.value);
        },
        value: 'Submit',
        label: "Submit"
    }, dojo.doc.createElement('button'));
    
    var resetbtn = new dijit.form.Button({
        type: 'reset',
        label: 'Reset'
    }, dojo.doc.createElement('button'));
    
    document.body.appendChild(form.domNode);
    form.domNode.appendChild(textbox.domNode);
    form.domNode.appendChild(submitbtn.domNode);
    form.domNode.appendChild(resetbtn.domNode);
}

dojo.addOnLoad(buildForm);