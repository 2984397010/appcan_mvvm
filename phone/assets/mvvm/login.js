var Service_wx5146 = new MVVM.Service({
    pretreatment: function(data, option) {
        return $.param(data);
    },
    dosuccess: function(data, option) {
        return data;
    },
    doerror: function(e, err, option) {
        return err;
    },
    validate: function(data, option) {
        return data.state;
    },
    ajaxCall: function(data, option) {
        var self = this;
        appcan.request.ajax({
            url: "http://42.96.172.127:19898/app/login",
            type: "POST",
            data: this.pretreatment(data, option),
            dataType: "json",
            contentType: "application/x-www-form-urlencoded",
            success: function(data) {
                var res = self.validate(data, option);
                if (!res) option.success(self.dosuccess(data, option));
                else option.error(self.doerror(data, res, option));
            },
            error: function(e, err) {
                option.error(self.doerror(e, err, option));
            }
        });
    }
});

function ajaxValidate(input ,cb){
    setTimeout(function(){
        cb('错误');
    },3000);
}
// Since we are automatically updating the model, we want the model
// to also hold invalid values, otherwise, we might be validating
// something else than the user has entered in the form.
// See: http://thedersen.com/projects/backbone-validation/#configuration/force-update
Backbone.Validation.configure({
    forceUpdate: false  //默认为false，如果设置为true，会导致savemodel不验证是否有表单错误
});
_.extend(Backbone.Validation.validators, {
  myValidator: function(value, attr, customValue, model) {
    return '';
  }
});
// Extend the callbacks to work with Bootstrap, as used in this example
// See: http://thedersen.com/projects/backbone-validation/#configuration/callbacks
_.extend(Backbone.Validation.callbacks, {
    valid: function (view, attr, selector) {
        var $el = view.$('[name=' + attr + ']'), 
            $group = $el.closest('.form-group');
        $group.removeClass('has-error');
        $group.find('.help-block').html('').addClass('hidden');
    },
    invalid: function (view, attr, error, selector) {
        var $el = view.$('[name=' + attr + ']'), 
            $group = $el.closest('.form-group');
        $group.addClass('has-error');
        $group.find('.help-block').html(error).removeClass('hidden');
    }
});

var Model_ubOmfB = new(MVVM.Model.extend({
    defaults: {
        // "username": "admin",
        // "password": "admin"
        'test':[{
            name:'my'
        },{
            name:'jay'
        }]
    },
    initialize: function(a) {
        return;
    },
    parse: function(data) {
        //可以处理属性，便于视图层渲染和控制
        data.addTest=true;
        return data.data;
    },
    validation: {
        username: {
           required: true,
           myValidator:1,
           length: 4
        },
        password: {
           required: true,
           length: 4
        }
        // someAttribute: function(value) {
          // if(value !== 'somevalue') {
            // return 'Error message';
          // }
        // }
    },
    validate: function(attrs, options) {
        //使用了validation，validate这个就没有用了，因为validation里面重写的那个方法
    },
    computeds: {},
    sync: function(method, model, options) {
        switch (method) {
        case "create":
            options.success({status:'0',data:'ok'});
            //Service_wx5146.request(this.toJSON(), options);
            break;
        case "update":
            break;
        case "patch":
            break;
        case "read":
            options.success({data:{username:'serveradmin',password:'admin'}});
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
}))()
//监听模型的异常
Model_ubOmfB.on("invalid", function(model, error) {
   // alert(JSON.stringify(error))
  //alert('username='+model.get("username") + ", 错误信息=" + error);
});
//监听模型的异常
Model_ubOmfB.on("change", function(model, error) {
   // model.validate();
});
var ViewModel_kLJmKa = new(MVVM.ViewModel.extend({
    el: "#ContentFlexVer_hTOHqG",
    events: {
        "tap #Button_JF4zxM": function(ev, param) {
            this.model.save({},{
                "success": function(model, resp, options) {
                    alert(JSON.stringify(resp));
                },
                "error": function(model, error, options) {
                    alert(error)
                }
            })
        },
    },
    initialize: function() {
        //Model_ubOmfB.set({username:'abc'})
        Model_ubOmfB.fetch();
        Backbone.Validation.bind(this);
    },
    remove: function() {
        // Remove the validation binding
        // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/unbinding
        Backbone.Validation.unbind(this);
        return Backbone.View.prototype.remove.apply(this, arguments);
    },
    model: Model_ubOmfB
}))();

// https://github.com/hongymagic/jQuery.serializeObject
$.fn.serializeObject = function () {
    "use strict";
    var a = {}, b = function (b, c) {
        var d = a[c.name];
        "undefined" != typeof d && d !== null ? $.isArray(d) ? d.push(c.value) : a[c.name] = [d, c.value] : a[c.name] = c.value
    };
    return $.each(this.serializeArray(), b), a
};