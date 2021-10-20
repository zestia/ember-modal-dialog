"use strict"
define("dummy/app",["exports","ember-resolver","ember-load-initializers","dummy/config/environment"],(function(e,i,t,n){function a(e,i,t){return i in e?Object.defineProperty(e,i,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[i]=t,e}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
class u extends Ember.Application{constructor(...e){super(...e),a(this,"modulePrefix",n.default.modulePrefix),a(this,"podModulePrefix",n.default.podModulePrefix),a(this,"Resolver",i.default)}}e.default=u,(0,t.default)(u,n.default.modulePrefix)})),define("dummy/component-managers/glimmer",["exports","@glimmer/component/-private/ember-component-manager"],(function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return i.default}})})),define("dummy/components/modal-dialog",["exports","@zestia/ember-modal-dialog/components/modal-dialog/index"],(function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return i.default}})})),define("dummy/controllers/application",["exports"],(function(e){var i,t,n,a,u,s,l,r,o
function d(e,i,t,n){t&&Object.defineProperty(e,i,{enumerable:t.enumerable,configurable:t.configurable,writable:t.writable,value:t.initializer?t.initializer.call(n):void 0})}function c(e,i,t){return i in e?Object.defineProperty(e,i,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[i]=t,e}function m(e,i,t,n,a){var u={}
return Object.keys(n).forEach((function(e){u[e]=n[e]})),u.enumerable=!!u.enumerable,u.configurable=!!u.configurable,("value"in u||u.initializer)&&(u.writable=!0),u=t.slice().reverse().reduce((function(t,n){return n(e,i,t)||t}),u),a&&void 0!==u.initializer&&(u.value=u.initializer?u.initializer.call(a):void 0,u.initializer=void 0),void 0===u.initializer&&(Object.defineProperty(e,i,u),u=null),u}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
let p=(i=Ember._tracked,t=Ember._tracked,n=Ember._action,a=Ember._action,u=Ember._action,s=Ember._action,l=class extends Ember.Controller{constructor(...e){super(...e),c(this,"testModalIsEscapable",!1),c(this,"testModalLoadDelay",!1),d(this,"showTestModal",r,this),d(this,"showMoreContent",o,this)}openTestModal(){this.showTestModal=!0}closeTestModal(){this.showTestModal=!1,this.showMoreContent=!1}addMoreContent(){this.showMoreContent=!0}loadTestModal(){if(this.testModalLoadDelay)return new Ember.RSVP.Promise((e=>{Ember.run.later(e,2e3)}))}},r=m(l.prototype,"showTestModal",[i],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return!1}}),o=m(l.prototype,"showMoreContent",[t],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return!1}}),m(l.prototype,"openTestModal",[n],Object.getOwnPropertyDescriptor(l.prototype,"openTestModal"),l.prototype),m(l.prototype,"closeTestModal",[a],Object.getOwnPropertyDescriptor(l.prototype,"closeTestModal"),l.prototype),m(l.prototype,"addMoreContent",[u],Object.getOwnPropertyDescriptor(l.prototype,"addMoreContent"),l.prototype),m(l.prototype,"loadTestModal",[s],Object.getOwnPropertyDescriptor(l.prototype,"loadTestModal"),l.prototype),l)
e.default=p})),define("dummy/initializers/container-debug-adapter",["exports","ember-resolver/resolvers/classic/container-debug-adapter"],(function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t={name:"container-debug-adapter",initialize(){(arguments[1]||arguments[0]).register("container-debug-adapter:main",i.default)}}
e.default=t})),define("dummy/modifiers/did-insert",["exports","@ember/render-modifiers/modifiers/did-insert"],(function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return i.default}})})),define("dummy/modifiers/did-update",["exports","@ember/render-modifiers/modifiers/did-update"],(function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return i.default}})})),define("dummy/modifiers/will-destroy",["exports","@ember/render-modifiers/modifiers/will-destroy"],(function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return i.default}})})),define("dummy/router",["exports","dummy/config/environment"],(function(e,i){function t(e,i,t){return i in e?Object.defineProperty(e,i,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[i]=t,e}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
class n extends Ember.Router{constructor(...e){super(...e),t(this,"location",i.default.locationType),t(this,"rootURL",i.default.rootURL)}}e.default=n,n.map((function(){}))})),define("dummy/templates/application",["exports"],(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var i=Ember.HTMLBars.template({id:"XgxC/C7n",block:'[[[10,3],[14,6,"https://github.com/zestia/ember-modal-dialog"],[12],[1,"\\n  "],[10,"img"],[14,5,"position: absolute; top: 0; right: 0; border: 0;"],[14,"width","149"],[14,"height","149"],[14,"src","https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149"],[14,0,"attachment-full size-full"],[14,"alt","Fork me on GitHub"],[14,"data-recalc-dims","1"],[12],[13],[1,"\\n"],[13],[1,"\\n\\n"],[10,0],[14,0,"inside-the-application"],[12],[1,"\\n  "],[10,"h1"],[12],[1,"\\n    @zestia/ember-modal-dialog\\n  "],[13],[1,"\\n\\n  "],[10,"fieldset"],[12],[1,"\\n    "],[10,"legend"],[12],[1,"\\n      Options\\n    "],[13],[1,"\\n    "],[10,"label"],[12],[1,"\\n      "],[8,[39,0],null,[["@type","@checked"],["checkbox",[30,0,["testModalIsEscapable"]]]],null],[1,"\\n      Escapable\\n    "],[13],[1,"\\n\\n    "],[10,"br"],[12],[13],[1,"\\n\\n    "],[10,"label"],[12],[1,"\\n      "],[8,[39,0],null,[["@type","@checked"],["checkbox",[30,0,["testModalLoadDelay"]]]],null],[1,"\\n      Load delay\\n    "],[13],[1,"\\n  "],[13],[1,"\\n\\n  "],[10,"br"],[12],[13],[1,"\\n  "],[10,"br"],[12],[13],[1,"\\n\\n  "],[11,"button"],[24,4,"button"],[4,[38,1],["click",[30,0,["openTestModal"]]],null],[12],[1,"\\n    Open\\n  "],[13],[1,"\\n\\n  "],[10,2],[12],[1,"\\n    The body will not be scrollable when the modal dialog is open, and focus\\n    will be trapped within the modal.\\n  "],[13],[1,"\\n\\n  "],[10,2],[12],[1,"\\n    When closing the modal, focus will be restored to the element that was\\n    originally focused.\\n  "],[13],[1,"\\n\\n  "],[10,0],[14,0,"example-text"],[12],[1,"\\n    "],[10,2],[12],[1,"\\n      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ut est eget\\n      nulla malesuada pretium id eu ipsum. Nam eu turpis et quam rutrum molestie\\n      a vitae tortor. Maecenas nec ex est. Nulla quis leo id leo commodo\\n      sagittis. Nullam diam dolor, semper sed convallis ut, facilisis\\n      sollicitudin quam. Ut a fermentum turpis, ac gravida elit. Fusce sed leo\\n      mollis nibh tincidunt ornare. Quisque convallis sodales erat, eget\\n      ultricies nulla pellentesque ut. Curabitur nec sem lorem.\\n    "],[13],[1,"\\n\\n    "],[10,2],[12],[1,"\\n      Vivamus malesuada arcu vitae mauris fringilla, sed lacinia nunc porta.\\n      Nullam id eros vitae arcu blandit tincidunt. Fusce porta sed mi sit amet\\n      varius. Proin congue accumsan rutrum. Aenean ac cursus ex. Sed sed\\n      venenatis urna. Aliquam elementum felis et eros egestas pellentesque.\\n      Nulla vulputate libero non cursus hendrerit.\\n    "],[13],[1,"\\n\\n    "],[10,2],[12],[1,"\\n      Aenean suscipit rhoncus sapien a blandit. Morbi urna nisi, porttitor sit\\n      amet lacus vitae, suscipit porta ipsum. Fusce blandit orci nec faucibus\\n      malesuada. In feugiat libero id nisl egestas, vel cursus nisi pulvinar.\\n      Pellentesque accumsan libero id nulla tincidunt tristique. Sed eget ligula\\n      enim. Cras iaculis lacinia ipsum id sodales. In sagittis tempus maximus.\\n      Duis ultrices urna magna, vitae vestibulum augue eleifend vitae. Cras\\n      tristique est quis ipsum ullamcorper tincidunt. Phasellus non dolor in\\n      urna scelerisque gravida. Ut volutpat tortor vitae risus tristique\\n      placerat. Vivamus iaculis varius nunc, nec tincidunt lorem facilisis non.\\n      Maecenas ultricies risus urna, finibus luctus erat posuere vitae.\\n    "],[13],[1,"\\n\\n    "],[10,2],[12],[1,"\\n      Fusce congue lacus ut augue varius faucibus non vel nunc. Suspendisse\\n      aliquet mi nisi, vel pharetra ipsum euismod ut. Proin elementum ante eu\\n      metus volutpat, vitae feugiat turpis commodo. Quisque tincidunt eget\\n      mauris ac iaculis. Proin rhoncus ligula ut augue sollicitudin aliquet at\\n      vel tellus. Vivamus congue sed nibh id gravida. Nulla fermentum aliquet\\n      sapien id pulvinar.\\n    "],[13],[1,"\\n\\n    "],[10,2],[12],[1,"\\n      Morbi ut dolor mauris. Sed elementum, arcu et tincidunt tincidunt, dolor\\n      elit finibus dolor, at volutpat metus felis at nisl. Nunc tempor blandit\\n      suscipit. Phasellus lacinia felis ac placerat dapibus. Vestibulum ante\\n      ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;\\n      Vivamus nec velit et elit scelerisque elementum. Mauris volutpat ante non\\n      condimentum vestibulum. Integer faucibus odio ac orci placerat feugiat.\\n      Sed fermentum lectus vitae sem molestie interdum. Integer egestas purus et\\n      velit facilisis, id mollis neque mollis. Sed risus eros, dignissim\\n      lobortis lacinia vel, vehicula sed sem. Phasellus nec interdum leo, sed\\n      mollis turpis.\\n    "],[13],[1,"\\n\\n    "],[10,2],[12],[1,"\\n      Fusce bibendum urna a purus condimentum, vitae volutpat turpis facilisis.\\n      Pellentesque nec nisl lectus. Donec turpis mauris, bibendum a est a,\\n      feugiat mollis nisi. Suspendisse luctus enim felis, eu ornare neque tempor\\n      et. Nullam nibh nisl, imperdiet dictum nisl ut, rutrum maximus ligula.\\n      Morbi euismod augue nisi, at vestibulum neque mattis venenatis. Morbi enim\\n      risus, eleifend vel mauris dictum, sagittis sagittis urna. Aliquam tempor\\n      dignissim urna, vitae tempor odio finibus quis.\\n    "],[13],[1,"\\n\\n    "],[10,2],[12],[1,"\\n      Mauris interdum sagittis neque id interdum. Nam eu vulputate felis.\\n      Praesent nec rutrum dui. Vivamus hendrerit tortor a tortor blandit\\n      viverra. Aliquam sagittis risus erat, nec imperdiet libero posuere eget.\\n      Aenean sed hendrerit ligula, eu rhoncus nisi. Aliquam ipsum mauris, cursus\\n      ut viverra vitae, lacinia accumsan arcu. Integer lorem tellus, sagittis ut\\n      euismod at, lacinia eu tortor. In sed felis pretium, dictum massa eu,\\n      tincidunt sapien. Aliquam in ante eu nisl sodales consequat quis eu eros.\\n      Aenean tempus risus et erat egestas, id lobortis massa laoreet.\\n    "],[13],[1,"\\n\\n    "],[10,2],[12],[1,"\\n      Nunc accumsan non mi laoreet varius. Morbi porttitor dapibus enim, eu\\n      tincidunt massa gravida sed. Mauris facilisis ipsum mauris. Praesent et\\n      accumsan leo. Nullam facilisis quam ut nisl finibus, ut dictum nulla\\n      pulvinar. Vestibulum quam urna, ultricies ac ornare eu, egestas sit amet\\n      turpis. Nunc dapibus mauris tellus. Etiam tristique convallis mi, at\\n      pellentesque arcu pretium sed. Pellentesque rutrum ultrices laoreet.\\n    "],[13],[1,"\\n\\n    "],[10,2],[12],[1,"\\n      Donec tincidunt in dolor nec aliquam. Suspendisse potenti. Curabitur quam\\n      erat, posuere non mauris ac, aliquet auctor sem. Mauris imperdiet massa id\\n      lectus tincidunt bibendum sed ut felis. Donec viverra augue dui, eu\\n      viverra diam pretium in. Maecenas dictum nec tortor sed rhoncus. Quisque\\n      rhoncus dui a elit scelerisque ultricies. Donec quis porta libero. Sed\\n      vestibulum a tellus ac cursus.\\n    "],[13],[1,"\\n\\n    "],[10,2],[12],[1,"\\n      Donec luctus enim eget erat condimentum ornare. Sed volutpat bibendum\\n      odio, et laoreet nisi tempor ac. Aliquam diam ex, hendrerit in elementum\\n      quis, placerat non magna. Vestibulum vulputate mauris eu tortor suscipit,\\n      ac bibendum magna rhoncus. Curabitur lacinia, ipsum vitae tincidunt\\n      dapibus, velit augue tincidunt est, ac ultrices nisl ex eu sapien. Etiam\\n      consequat sem eget tortor ultrices, at ultrices nulla vulputate. Vivamus\\n      venenatis eleifend luctus. Nam eget augue imperdiet velit varius lobortis\\n      ut nec lacus. Aenean iaculis neque quis tempus suscipit. Fusce aliquet\\n      mattis eros, nec mattis diam feugiat eu.\\n    "],[13],[1,"\\n  "],[13],[1,"\\n"],[13],[1,"\\n\\n"],[10,0],[14,0,"outside-the-application"],[12],[1,"\\n"],[41,[30,0,["showTestModal"]],[[[1,"    "],[8,[39,3],null,[["@onClose","@onLoad","@escapable"],[[30,0,["closeTestModal"]],[30,0,["loadTestModal"]],[30,0,["testModalIsEscapable"]]]],[["default"],[[[[1,"\\n      "],[8,[30,1,["Header"]],null,null,[["default"],[[[[1,"\\n        Header\\n      "]],[]]]]],[1,"\\n\\n      "],[8,[30,1,["Content"]],null,null,[["default"],[[[[1,"\\n"],[41,[30,1,["isLoading"]],[[[1,"          Please wait...\\n"]],[]],[[[1,"          "],[10,2],[12],[1,"\\n            The content of the modal dialog box is scrollable if it doesn\'t fit\\n            into the viewport.\\n          "],[13],[1,"\\n\\n          "],[10,2],[12],[1,"\\n            Tabbing through focusable elements will not escape to outside of the\\n            modal.\\n          "],[13],[1,"\\n\\n          "],[10,"input"],[14,"aria-label","Example input"],[14,"placeholder","Example input"],[14,4,"text"],[12],[13],[1,"\\n\\n"],[41,[30,0,["showMoreContent"]],[[[1,"            "],[10,2],[12],[1,"\\n              "],[10,"strong"],[12],[1,"\\n                When there is too much vertical content for the size of the\\n                viewport, a class is added to the modal dialog.\\n              "],[13],[1,"\\n            "],[13],[1,"\\n"]],[]],null],[1,"\\n          "],[10,0],[14,0,"example-text"],[12],[1,"\\n            "],[10,2],[12],[1,"\\n              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ut\\n              est eget nulla malesuada pretium id eu ipsum. Nam eu turpis et\\n              quam rutrum molestie a vitae tortor. Maecenas nec ex est. Nulla\\n              quis leo id leo commodo sagittis. Nullam diam dolor, semper sed\\n              convallis ut, facilisis sollicitudin quam. Ut a fermentum turpis,\\n              ac gravida elit. Fusce sed leo mollis nibh tincidunt ornare.\\n              Quisque convallis sodales erat, eget ultricies nulla pellentesque\\n              ut. Curabitur nec sem lorem.\\n            "],[13],[1,"\\n\\n            "],[10,2],[12],[1,"\\n              Vivamus malesuada arcu vitae mauris fringilla, sed lacinia nunc\\n              porta. Nullam id eros vitae arcu blandit tincidunt. Fusce porta\\n              sed mi sit amet varius. Proin congue accumsan rutrum. Aenean ac\\n              cursus ex. Sed sed venenatis urna. Aliquam elementum felis et eros\\n              egestas pellentesque. Nulla vulputate libero non cursus hendrerit.\\n            "],[13],[1,"\\n\\n            "],[10,2],[12],[1,"\\n              Aenean suscipit rhoncus sapien a blandit. Morbi urna nisi,\\n              porttitor sit amet lacus vitae, suscipit porta ipsum. Fusce\\n              blandit orci nec faucibus malesuada. In feugiat libero id nisl\\n              egestas, vel cursus nisi pulvinar. Pellentesque accumsan libero id\\n              nulla tincidunt tristique. Sed eget ligula enim. Cras iaculis\\n              lacinia ipsum id sodales. In sagittis tempus maximus. Duis\\n              ultrices urna magna, vitae vestibulum augue eleifend vitae. Cras\\n              tristique est quis ipsum ullamcorper tincidunt. Phasellus non\\n              dolor in urna scelerisque gravida. Ut volutpat tortor vitae risus\\n              tristique placerat. Vivamus iaculis varius nunc, nec tincidunt\\n              lorem facilisis non. Maecenas ultricies risus urna, finibus luctus\\n              erat posuere vitae.\\n            "],[13],[1,"\\n\\n"],[41,[30,0,["showMoreContent"]],[[[1,"              "],[10,2],[12],[1,"\\n                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla\\n                ut est eget nulla malesuada pretium id eu ipsum. Nam eu turpis\\n                et quam rutrum molestie a vitae tortor. Maecenas nec ex est.\\n                Nulla quis leo id leo commodo sagittis. Nullam diam dolor,\\n                semper sed convallis ut, facilisis sollicitudin quam. Ut a\\n                fermentum turpis, ac gravida elit. Fusce sed leo mollis nibh\\n                tincidunt ornare. Quisque convallis sodales erat, eget ultricies\\n                nulla pellentesque ut. Curabitur nec sem lorem.\\n              "],[13],[1,"\\n\\n              "],[10,2],[12],[1,"\\n                Vivamus malesuada arcu vitae mauris fringilla, sed lacinia nunc\\n                porta. Nullam id eros vitae arcu blandit tincidunt. Fusce porta\\n                sed mi sit amet varius. Proin congue accumsan rutrum. Aenean ac\\n                cursus ex. Sed sed venenatis urna. Aliquam elementum felis et\\n                eros egestas pellentesque. Nulla vulputate libero non cursus\\n                hendrerit.\\n              "],[13],[1,"\\n\\n              "],[10,2],[12],[1,"\\n                Aenean suscipit rhoncus sapien a blandit. Morbi urna nisi,\\n                porttitor sit amet lacus vitae, suscipit porta ipsum. Fusce\\n                blandit orci nec faucibus malesuada. In feugiat libero id nisl\\n                egestas, vel cursus nisi pulvinar. Pellentesque accumsan libero\\n                id nulla tincidunt tristique. Sed eget ligula enim. Cras iaculis\\n                lacinia ipsum id sodales. In sagittis tempus maximus. Duis\\n                ultrices urna magna, vitae vestibulum augue eleifend vitae. Cras\\n                tristique est quis ipsum ullamcorper tincidunt. Phasellus non\\n                dolor in urna scelerisque gravida. Ut volutpat tortor vitae\\n                risus tristique placerat. Vivamus iaculis varius nunc, nec\\n                tincidunt lorem facilisis non. Maecenas ultricies risus urna,\\n                finibus luctus erat posuere vitae.\\n              "],[13],[1,"\\n"]],[]],null],[1,"          "],[13],[1,"\\n"]],[]]],[1,"      "]],[]]]]],[1,"\\n\\n      "],[8,[30,1,["Footer"]],null,null,[["default"],[[[[1,"\\n        Footer\\n\\n        "],[11,"button"],[16,"disabled",[30,0,["showMoreContent"]]],[24,4,"button"],[4,[38,1],["click",[30,0,["addMoreContent"]]],null],[12],[1,"\\n          Add more content\\n        "],[13],[1,"\\n\\n        "],[11,"button"],[24,4,"button"],[4,[38,1],["click",[30,1,["close"]]],null],[12],[1,"\\n          Close\\n        "],[13],[1,"\\n      "]],[]]]]],[1,"\\n    "]],[1]]]]],[1,"\\n"]],[]],null],[13]],["modal"],false,["input","on","if","modal-dialog"]]',moduleName:"dummy/templates/application.hbs",isStrictMode:!1})
e.default=i})),define("dummy/templates/components/modal-dialog/content",["exports","@zestia/ember-modal-dialog/components/modal-dialog/content"],(function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return i.default}})})),define("dummy/templates/components/modal-dialog/footer",["exports","@zestia/ember-modal-dialog/components/modal-dialog/footer"],(function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return i.default}})})),define("dummy/templates/components/modal-dialog/header",["exports","@zestia/ember-modal-dialog/components/modal-dialog/header"],(function(e,i){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return i.default}})})),define("dummy/config/environment",[],(function(){try{var e="dummy/config/environment",i=document.querySelector('meta[name="'+e+'"]').getAttribute("content"),t={default:JSON.parse(decodeURIComponent(i))}
return Object.defineProperty(t,"__esModule",{value:!0}),t}catch(n){throw new Error('Could not read config from meta tag with name "'+e+'".')}})),runningTests||require("dummy/app").default.create({})