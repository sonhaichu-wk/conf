(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{117:function(e,t,a){"use strict";var n,s,r;a.d(t,"a",(function(){return n})),a.d(t,"d",(function(){return s})),a.d(t,"b",(function(){return r})),a.d(t,"e",(function(){return i})),a.d(t,"c",(function(){return l})),function(e){e.Bug="bug",e.Comment="comment",e.Suggestion="suggestion",e.Question="question",e.Empty=""}(n||(n={})),function(e){e.BitbucketIssueWebview="bitbucketIssueScreen",e.CreateBitbucketIssueWebview="createBitbucketIssueScreen",e.ConfigWebview="atlascodeSettings",e.OnboardingWebview="atlascodeOnboardingScreen",e.WelcomeWebview="atlascodeWelcomeScreen",e.StartWork="startWorkOnIssueScreen",e.PullRequestDetailsWebview="pullRequestDetailsScreen",e.CreatePullRequest="createPullRequestScreen",e.CreateJiraIssueWebview="atlascodeCreateIssueScreen"}(s||(s={})),function(e){e.AtlascodeRepo="atlascodeRepoLink",e.AtlascodeIssues="atlascodeIssuesLink",e.AtlascodeDocs="atlascodeDocsLink",e.Integrations="integrationsLink",e.GettingStarted="gettingStartedLink",e.ReportAnIssue="reportAnIssueLink",e.WhatIsJQL="whatIsJQLLink",e.Contribute="contributeLink",e.TweetAboutUs="tweetaboutus"}(r||(r={}));new Map([[r.AtlascodeRepo,"https://bitbucket.org/atlassianlabs/atlascode"],[r.AtlascodeIssues,"https://bitbucket.org/atlassianlabs/atlascode/issues"],[r.AtlascodeDocs,"https://confluence.atlassian.com/display/BITBUCKET/Atlassian+for+VS+Code"],[r.Integrations,"https://integrations.atlassian.com"],[r.GettingStarted,"https://confluence.atlassian.com/bitbucket/getting-started-with-vs-code-969520759.html"],[r.ReportAnIssue,"https://bitbucket.org/atlassianlabs/atlascode/issues?status=new&status=open"],[r.WhatIsJQL,"https://www.atlassian.com/blog/jira-software/jql-the-most-flexible-way-to-search-jira-14"],[r.Contribute,"https://bitbucket.org/atlassianlabs/atlascode/src/devel/"],[r.TweetAboutUs,"https://twitter.com/intent/tweet?text="+encodeURIComponent("Check out Atlassian's awesome Bitbucket and Jira extension for VS Code! https://marketplace.visualstudio.com/items/Atlassian.atlascode")]]);const i={userName:"",emailAddress:""};var l;!function(e){e.VERY="Very disappointed",e.SOMEWHAT="Somewhat disappointed",e.NOT="Not disappointed"}(l||(l={}))},143:function(e,t,a){"use strict";a.d(t,"a",(function(){return l}));var n,s=a(0);!function(e){e.Error="error",e.OnlineStatus="onlineStatus",e.PMFStatus="pmfStatus"}(n||(n={}));var r=a(18),i=a(20);function l(e){const t=Object(s.useMemo)(acquireVsCodeApi,[acquireVsCodeApi]),a=Object(s.useCallback)(e=>{t.postMessage(e)},[t]),l=Object(s.useCallback)((e,a,s,r)=>(t.postMessage(e),new Promise((e,t)=>{const i=setTimeout(()=>{window.removeEventListener("message",l),clearTimeout(i),t("timeout waiting for event "+a)},s),l=s=>{!s.data.type||!a||s.data.type!==a||r&&s.data.nonce!==r||(clearTimeout(i),window.removeEventListener("message",l),e(s.data)),s.data.type===n.Error&&r&&s.data.nonce===r&&(window.removeEventListener("message",l),clearTimeout(i),t(s.data.reason))};window.addEventListener("message",l)})),[t]),c=Object(s.useContext)(r.a),o=Object(s.useContext)(i.a),u=Object(s.useCallback)(t=>{const a=t.data;if(a&&a.type)switch(a.type){case n.Error:c.showError(a.reason);break;case n.OnlineStatus:break;case n.PMFStatus:a.showPMF&&o.showPMFBanner();break;default:e(a)}},[c,o,e]);return Object(s.useEffect)(()=>(window.addEventListener("message",u),t.postMessage({type:"refresh"}),()=>{window.removeEventListener("message",u)}),[e,u,t]),[a,l]}},196:function(e,t,a){"use strict";a.d(t,"a",(function(){return E}));var n=a(933),s=a(68),r=a(346),i=a(901),l=a(386),c=a(188),o=a.n(c),u=a(385),d=a(374),m=a(0),p=a.n(m),b=a(118),g=a(18);const h=Object(s.a)(e=>({indent:{marginLeft:e.spacing(3)}})),E=({})=>{const e=h(),t=Object(m.useContext)(g.b),a=Object(m.useContext)(g.a),[s,c]=Object(m.useState)(t.isErrorBannerOpen);Object(m.useEffect)(()=>{c(e=>e!==t.isErrorBannerOpen?t.isErrorBannerOpen:e)},[t.isErrorBannerOpen]);const E=[];Object(n.a)(t.errorDetails)?(Object.keys(t.errorDetails.errors).forEach(a=>{E.push(p.a.createElement("p",{key:a},p.a.createElement("b",null,a,":"),p.a.createElement("span",{className:e.indent},t.errorDetails.errors[a])))}),t.errorDetails.errorMessages.forEach(t=>{E.push(p.a.createElement("p",{key:Object(b.v4)()},p.a.createElement("span",{className:e.indent},t)))})):Object(n.b)(t.errorDetails)?t.errorDetails.errorMessages.forEach(t=>{E.push(p.a.createElement("p",{key:Object(b.v4)()},p.a.createElement("span",{className:e.indent},t)))}):"object"===typeof t.errorDetails?Object.keys(t.errorDetails).forEach(a=>{E.push(p.a.createElement("p",{key:a},p.a.createElement("b",null,a,":"),p.a.createElement("span",{className:e.indent},JSON.stringify(t.errorDetails[a]))))}):E.push(p.a.createElement("p",{key:Object(b.v4)()},t.errorDetails));const f=Object(m.useCallback)(()=>{a.dismissError(),c(!1)},[a]),v=Object(m.useCallback)(()=>{c(!1)},[]),y=t.errorDetails&&t.errorDetails.title?t.errorDetails.title:"Something went wrong";return p.a.createElement(p.a.Fragment,null,p.a.createElement(r.a,{in:t.isErrorBannerOpen},p.a.createElement(u.a,{variant:"standard",severity:"error",action:p.a.createElement(i.a,{"aria-label":"close",color:"inherit",size:"small",onClick:f},p.a.createElement(o.a,{fontSize:"inherit"}))},p.a.createElement(d.a,null,y),E)),p.a.createElement(l.a,{open:s,autoHideDuration:6e3,onClose:v,anchorOrigin:{vertical:"bottom",horizontal:"left"}},p.a.createElement(u.a,{variant:"standard",severity:"error",action:p.a.createElement(i.a,{"aria-label":"close",color:"inherit",size:"small",onClick:v},p.a.createElement(o.a,{fontSize:"inherit"}))},p.a.createElement(d.a,null,y),p.a.createElement("p",null,"See details at the top of this page"))))}},320:function(e,t,a){"use strict";a.d(t,"a",(function(){return S}));var n=a(346),s=a(917),r=a(73),i=a(912),l=a(385),c=a(374),o=a(0),u=a.n(o),d=a(20),m=a(388),p=a(402),b=a(74),g=a(376),h=a(904),E=a(905),f=a(456),v=a(437),y=a(453),k=a(908),I=a(934),O=a(377),w=a(197),C=a(117);const j=({open:e,onCancel:t,onSave:a})=>{const{register:n,handleSubmit:l,errors:c,formState:d,triggerValidation:j,control:S,reset:U}=Object(w.b)({mode:"onChange"}),T=Object(o.useCallback)(e=>{a(e)},[a]),M=Object(o.useCallback)(()=>{U(),t()},[t,U]),F=Object(o.useCallback)(()=>{j("level")},[j]);return u.a.createElement(m.a,{fullWidth:!0,maxWidth:"md",open:e,onClose:t},u.a.createElement(p.a,null,u.a.createElement(b.a,{variant:"h4"},"How Are We Doing?")),u.a.createElement(g.a,null,u.a.createElement(r.a,{container:!0,direction:"column",spacing:2},u.a.createElement(r.a,{item:!0},u.a.createElement(w.a,{as:u.a.createElement(h.a,{component:"fieldset",onBlur:F},u.a.createElement(E.a,{component:"legend",required:!0,error:void 0!==c.level},"How would you feel if you could no longer use this extension?"),u.a.createElement(f.a,{"aria-label":"level",name:"level"},u.a.createElement(v.a,{value:C.c.VERY,control:u.a.createElement(y.a,{autoFocus:!0,color:"primary"}),label:C.c.VERY}),u.a.createElement(v.a,{value:C.c.SOMEWHAT,control:u.a.createElement(y.a,{color:"primary"}),label:C.c.SOMEWHAT}),u.a.createElement(v.a,{value:C.c.NOT,control:u.a.createElement(y.a,{color:"primary"}),label:C.c.NOT})),u.a.createElement(k.a,{error:void 0!==c.level},c.level?c.level.message:"")),rules:{required:"Level is required"},name:"level",control:S})),u.a.createElement(r.a,{item:!0},u.a.createElement(I.a,{multiline:!0,rows:3,variant:"outlined",autoComplete:"off",margin:"dense",id:"improvements",name:"improvements",label:"How can we improve this extension for you?",fullWidth:!0,inputRef:n})),u.a.createElement(r.a,{item:!0},u.a.createElement(I.a,{multiline:!0,rows:3,variant:"outlined",autoComplete:"off",margin:"dense",id:"alternative",name:"alternative",label:"What would you use as an alternative if this extension were no longer available?",fullWidth:!0,inputRef:n})),u.a.createElement(r.a,{item:!0},u.a.createElement(I.a,{multiline:!0,rows:3,variant:"outlined",autoComplete:"off",margin:"dense",id:"benefits",name:"benefits",label:"What are the main benefits you receive from this extension?",fullWidth:!0,inputRef:n})))),u.a.createElement(O.a,null,u.a.createElement(i.a,{disabled:!d.isValid,onClick:l(T),variant:"contained",color:"primary"},"Submit"),u.a.createElement(i.a,{onClick:M,color:"primary"},"Cancel")),u.a.createElement(s.a,{marginBottom:2}))},S=({postMessageFunc:e})=>{const t=Object(o.useContext)(d.c),a=Object(o.useContext)(d.a),m=Object(o.useCallback)(()=>{a.dismissPMFBanner(d.b.LATER,e)},[a,e]),p=Object(o.useCallback)(()=>{a.dismissPMFBanner(d.b.NEVER,e)},[a,e]),b=Object(o.useCallback)(()=>{a.showPMFSurvey(e)},[a,e]),g=Object(o.useCallback)(t=>{a.submitPMFSurvey(t,e)},[a,e]);return u.a.createElement("div",null,u.a.createElement(n.a,{in:t.isPMFBannerOpen},u.a.createElement(l.a,{severity:"info"},u.a.createElement(c.a,null,"Take a quick survey to let us know how we're doing"),u.a.createElement(s.a,{marginBottom:2}),u.a.createElement(r.a,{spacing:3,container:!0},u.a.createElement(r.a,{item:!0},u.a.createElement(i.a,{variant:"contained",color:"primary",size:"small",onClick:b},"Take Survey")),u.a.createElement(r.a,{item:!0},u.a.createElement(i.a,{color:"inherit",size:"small",onClick:m},"Maybe Later")),u.a.createElement(r.a,{item:!0},u.a.createElement(i.a,{color:"inherit",size:"small",onClick:p},"No Thanks"))))),u.a.createElement(j,{open:t.isPMFSurveyOpen,onCancel:m,onSave:g}))}},689:function(e,t,a){"use strict";a.d(t,"a",(function(){return s}));var n=a(855);class s{constructor(e,t){this._meta=e,this._renderer=t}getSortedFieldUIs(){if(!this._meta.issueTypeUIs[this._meta.selectedIssueType.id])return[[],[]];const e=this.sortFieldValues(this._meta.issueTypeUIs[this._meta.selectedIssueType.id].fields),t=[],a=[];return e.forEach(e=>{e.advanced?t.push(e):a.push(e)}),[a,t]}getCommonFieldMarkup(){const[e]=this.getSortedFieldUIs();return console.log(e.length),e.map(e=>this.renderFieldUI(e))}getAdvancedFieldMarkup(){const[,e]=this.getSortedFieldUIs();return e.map(e=>this.renderFieldUI(e))}sortFieldValues(e){return Object.values(e).sort((e,t)=>e.displayOrder<t.displayOrder?-1:e.displayOrder>t.displayOrder?1:0)}renderFieldUI(e){switch(e.uiType){case n.UIType.Input:{const t=e;return t.isMultiline?this._renderer.renderTextAreaInput(t,this._meta.issueTypeUIs[this._meta.selectedIssueType.id].fieldValues[e.key]):this._renderer.renderTextInput(t,this._meta.issueTypeUIs[this._meta.selectedIssueType.id].fieldValues[e.key])}case n.UIType.Select:{const t=e;return t.valueType===n.ValueType.IssueType?this._renderer.renderIssueTypeSelector(t,this._meta.issueTypeUIs[this._meta.selectedIssueType.id].selectFieldOptions[e.key],this._meta.issueTypeUIs[this._meta.selectedIssueType.id].fieldValues[e.key]):this._renderer.renderSelectInput(t,this._meta.issueTypeUIs[this._meta.selectedIssueType.id].selectFieldOptions[e.key],this._meta.issueTypeUIs[this._meta.selectedIssueType.id].fieldValues[e.key])}}}}},690:function(e,t){},854:function(e,t,a){"use strict";var n=a(689);a.d(t,"CreateIssueUIHelper",(function(){return n.a}));a(690)},923:function(e,t,a){"use strict";a.r(t);var n,s=a(68),r=a(71),i=a(381),l=a(353),c=a(74),o=a(917),u=a(73),d=a(906),m=a(909),p=a(0),b=a.n(p),g=a(196),h=a(320),E=a(21),f=a(854),v=a(12);!function(e){e.GetCreateMeta="getCreateMeta"}(n||(n={}));var y,k=a(117),I=a(723),O=a(97);!function(e){e.Init="init"}(y||(y={}));const w={site:O.g,project:I.d,screenData:{issueTypes:[],selectedIssueType:I.b,issueTypeUIs:{},problems:{}}};var C=a(934),j=a(378),S=a(407);class U{constructor(e){this._dispatch=e}renderTextInput(e,t){return b.a.createElement(C.a,{required:e.required,autoFocus:!0,autoComplete:"off",margin:"dense",id:e.key,key:e.key,name:e.key,label:e.name,fullWidth:!0,onChange:t=>{this._dispatch({type:D.FieldUpdate,fieldUI:e,value:t.target.value})}})}renderTextAreaInput(e,t){return b.a.createElement(C.a,{required:e.required,autoFocus:!0,autoComplete:"off",margin:"dense",id:e.key,key:e.key,name:e.key,label:e.name,fullWidth:!0,multiline:!0,rows:5,onChange:t=>{this._dispatch({type:D.FieldUpdate,fieldUI:e,value:t.target.value})}})}renderIssueTypeSelector(e,t,a){return b.a.createElement(C.a,{select:!0,size:"small",margin:"dense",value:(null===a||void 0===a?void 0:a.id)||"",onChange:a=>{this._dispatch({type:D.FieldUpdate,fieldUI:e,value:t.find(e=>e.id===a.target.value)})},id:e.key,key:e.key,name:e.key,label:e.name},t.map(e=>b.a.createElement(j.a,{key:e.id,value:e.id},b.a.createElement(u.a,{container:!0,spacing:1,direction:"row",alignItems:"center"},b.a.createElement(u.a,{item:!0},b.a.createElement(S.a,{style:{height:"1em",width:"1em"},variant:"square",src:e.iconUrl})),b.a.createElement(u.a,{item:!0},b.a.createElement(c.a,null,e.name))))))}renderSelectInput(e,t,a){return b.a.createElement(C.a,{select:!0,size:"small",margin:"dense",value:(null===a||void 0===a?void 0:a.id)||"",onChange:a=>{this._dispatch({type:D.FieldUpdate,fieldUI:e,value:t.find(e=>e.id===a.target.value)})},id:e.key,key:e.key,name:e.key,label:e.name},t.map(e=>b.a.createElement(j.a,{key:e.id,value:e.id},b.a.createElement(u.a,{container:!0,spacing:1,direction:"row",alignItems:"center"},b.a.createElement(u.a,{item:!0,hidden:!e.iconUrl},b.a.createElement(S.a,{style:{height:"1em",width:"1em"},variant:"square",src:e.iconUrl})),b.a.createElement(u.a,{item:!0},b.a.createElement(c.a,null,e.name))))))}}var T=a(143);const M={postMessage:()=>{},refresh:()=>{},openLink:()=>{},createIssueUIHelper:void 0},F=b.a.createContext(M),L=Object.assign(Object.assign({},w),{isSomethingLoading:!1});var D;function W(e,t){switch(t.type){case D.Init:return Object.assign(Object.assign(Object.assign({},e),t.data),{isSomethingLoading:!1,isErrorBannerOpen:!1,errorDetails:void 0});case D.FieldUpdate:{console.log(t),console.log(e);const a="issuetype"===t.fieldUI.key?t.value:e.screenData.selectedIssueType,n=Object.assign(Object.assign({},e),{screenData:Object.assign(Object.assign({},e.screenData),{issueTypeUIs:Object.assign(Object.assign({},e.screenData.issueTypeUIs),{[a.id]:Object.assign(Object.assign({},e.screenData.issueTypeUIs[a.id]),{fieldValues:Object.assign(Object.assign({},e.screenData.issueTypeUIs[a.id].fieldValues),{[t.fieldUI.key]:t.value})})}),selectedIssueType:a})});return console.log(n),n}case D.Loading:return Object.assign(Object.assign({},e),{isSomethingLoading:!0});default:return Object(E.b)(e,t)}}!function(e){e.Init="init",e.FieldUpdate="fieldUpdate",e.Loading="loading"}(D||(D={}));const A=Object(s.a)(e=>({title:{flexGrow:0,marginRight:e.spacing(3),marginLeft:e.spacing(1)},targetSelectLabel:{marginRight:e.spacing(1)},grow:{flexGrow:1},paper100:{overflow:"hidden",height:"100%"},paperOverflow:{overflow:"hidden"}}));t.default=()=>{const e=A(),[t,a]=function(){const[e,t]=Object(p.useReducer)(W,L),a=Object(p.useCallback)(e=>{switch(e.type){case y.Init:t({type:D.Init,data:e})}},[]),[s]=Object(T.a)(a),r=Object(p.useCallback)(()=>{t({type:D.Loading}),s({type:v.a.Refresh})},[s]),i=Object(p.useCallback)(e=>s({type:v.a.ExternalLink,source:k.d.CreateJiraIssueWebview,linkId:e}),[s]),l=b.a.useMemo(()=>new U(t),[t]),c=b.a.useMemo(()=>new f.CreateIssueUIHelper(e.screenData,l),[l,e.screenData]);b.a.useEffect(()=>{s({type:n.GetCreateMeta,site:e.site,projectKey:e.project.key})},[e.site.id,e.project.key,s]);const o=Object(p.useMemo)(()=>({postMessage:s,refresh:r,openLink:i,createIssueUIHelper:c}),[i,s,r,c]);return[e,o]}();return b.a.createElement(F.Provider,{value:a},b.a.createElement(r.a,{maxWidth:"xl"},b.a.createElement(i.a,{position:"relative"},b.a.createElement(l.a,null,b.a.createElement(c.a,{variant:"h3",className:e.title},"Create issue"),b.a.createElement(o.a,{className:e.grow}))),b.a.createElement(u.a,{container:!0,spacing:1},b.a.createElement(u.a,{item:!0,xs:12,zeroMinWidth:!0},b.a.createElement(d.a,{className:e.paper100},b.a.createElement(o.a,{margin:2},b.a.createElement(g.a,null),b.a.createElement(h.a,{postMessageFunc:a.postMessage}),b.a.createElement(u.a,{container:!0,spacing:2,direction:"column"},b.a.createElement(u.a,{item:!0},b.a.createElement(c.a,null,"Site: ",t.site.name)),a.createIssueUIHelper&&a.createIssueUIHelper.getCommonFieldMarkup().map(e=>b.a.createElement(u.a,{item:!0},e)),b.a.createElement(u.a,{item:!0},b.a.createElement(m.a,null)),a.createIssueUIHelper&&a.createIssueUIHelper.getAdvancedFieldMarkup().map(e=>b.a.createElement(u.a,{item:!0},e)))))))))}},97:function(e,t,a){"use strict";var n;a.d(t,"c",(function(){return s})),a.d(t,"b",(function(){return r})),a.d(t,"a",(function(){return l})),a.d(t,"h",(function(){return c})),a.d(t,"g",(function(){return o})),a.d(t,"d",(function(){return u})),a.d(t,"e",(function(){return d})),a.d(t,"f",(function(){return m})),function(e){e.Update="update",e.Remove="remove"}(n||(n={}));const s={name:"Jira",key:"jira"},r={name:"Bitbucket",key:"bitbucket"};var i,l;!function(e){e.BitbucketCloud="bbcloud",e.BitbucketCloudStaging="bbcloudstaging",e.JiraCloud="jiracloud",e.JiraCloudStaging="jiracloudstaging"}(i||(i={})),function(e){e[e.Valid=0]="Valid",e[e.Invalid=1]="Invalid"}(l||(l={}));const c={id:"",displayName:"",email:"",avatarUrl:""},o={id:"",name:"",avatarUrl:"",host:"",baseLinkUrl:"",baseApiUrl:"",product:{name:"",key:""},isCloud:!0,userId:"",credentialId:""},u={id:"",name:"",avatarUrl:"",scopes:[],baseUrlSuffix:"atlassian.net"},d={user:c,state:l.Valid},m={user:c,username:"",password:"",state:l.Valid}}}]);