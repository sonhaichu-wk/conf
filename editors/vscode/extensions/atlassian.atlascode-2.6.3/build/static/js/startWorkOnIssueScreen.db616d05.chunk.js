(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{122:function(e,t,a){"use strict";a.d(t,"a",(function(){return r})),a.d(t,"b",(function(){return i})),a.d(t,"c",(function(){return o})),a.d(t,"d",(function(){return c}));const s=/^(?:(#?)([0-9a-f]{3}|[0-9a-f]{6})|((?:rgb|hsl)a?)\((-?\d+%?)[,\s]+(-?\d+%?)[,\s]+(-?\d+%?)[,\s]*(-?[\d\.]+%?)?\))$/i;function n(e,t){const a=e+t,s=t<0?a<0?0:a:a>255?255:a;return Math.round(s)}const r={neutral:"default","blue-gray":"default","medium-gray":"default",purple:"new",brown:"new",blue:"inprogress",red:"removed","warm-red":"removed",yellow:"inprogress",green:"success"};function i(e,t){return o(e,-t)}function o(e,t){const a=l(e);if(null===a)return e;const[s,r,i,o]=a;return`rgba(${n(s,t=255*t/100)}, ${n(r,t)}, ${n(i,t)}, ${o})`}function c(e,t){const a=l(e);if(null===a)return e;const[s,n,r,i]=a;return`rgba(${s}, ${n}, ${r}, ${i*(t/100)})`}function l(e){e=e.trim();const t=s.exec(e);if(null===t)return null;if("#"===t[1]){const e=t[2];switch(e.length){case 3:return[parseInt(e[0]+e[0],16),parseInt(e[1]+e[1],16),parseInt(e[2]+e[2],16),1];case 6:return[parseInt(e.substring(0,2),16),parseInt(e.substring(2,4),16),parseInt(e.substring(4,6),16),1]}return null}switch(t[3]){case"rgb":return[parseInt(t[4],10),parseInt(t[5],10),parseInt(t[6],10),1];case"rgba":return[parseInt(t[4],10),parseInt(t[5],10),parseInt(t[6],10),parseFloat(t[7])];default:return null}}},135:function(e,t,a){"use strict";a.d(t,"a",(function(){return s})),a.d(t,"k",(function(){return n})),a.d(t,"g",(function(){return r})),a.d(t,"l",(function(){return i})),a.d(t,"e",(function(){return o})),a.d(t,"h",(function(){return c})),a.d(t,"b",(function(){return l})),a.d(t,"m",(function(){return u})),a.d(t,"f",(function(){return d})),a.d(t,"i",(function(){return p})),a.d(t,"c",(function(){return m})),a.d(t,"j",(function(){return h})),a.d(t,"d",(function(){return b}));const s=(...e)=>(...t)=>e.forEach(e=>e(...t));function n(e,t){return void 0!==e?void 0:"EMPTY"}function r(e,t){}function i(e,t){return void 0===e||e.trim().length<1?"EMPTY":void 0}function o(e){return void 0===i(e)}function c(e,t){let a=void 0;if(void 0!==e&&e.length>0){let t=NaN;t="number"===typeof e?e:parseFloat(e),a=isNaN(t)?"NOT_NUMBER":void 0}return a}function l(e){return void 0===c(e)}function u(e,t){let a=void 0;try{""===new URL(e).hostname&&(a="NOT_URL")}catch(e){a="NOT_URL"}return a}function d(e){return void 0===u(e)}function p(e,t){let a=i(e);return void 0===a&&(a=c(e)),a}function m(e){return void 0===p(e)}function h(e,t){let a=i(e);return void 0===a&&(a=u(e)),a}function b(e){return void 0===h(e)}},206:function(e,t,a){"use strict";a.d(t,"b",(function(){return s})),a.d(t,"e",(function(){return n})),a.d(t,"d",(function(){return r})),a.d(t,"c",(function(){return i})),a.d(t,"a",(function(){return o}));const s={details:a(98).f,ownerSlug:"",repoSlug:""},n={accountId:"",displayName:"",url:"",avatarUrl:"",mention:""},r={commentId:"",creator:n,created:"",updated:"",isComplete:!1,id:"",editable:!1,deletable:!1,content:""},i={id:"",deletable:!1,editable:!1,user:n,htmlContent:"",rawContent:"",ts:"",updatedTs:"",deleted:!1,children:[],tasks:[]};var o;!function(e){e.ADDED="A",e.DELETED="D",e.COPIED="C",e.MODIFIED="M",e.RENAMED="R",e.CONFLICT="CONFLICT",e.UNKNOWN="X"}(o||(o={}))},222:function(e,t,a){"use strict";a.d(t,"a",(function(){return i}));var s=a(0),n=a.n(s),r=a(35);const i=e=>{const t=Object(s.useContext)(r.a);return n.a.createElement("div",{className:"ac-atl-loader-container"},n.a.createElement("img",{className:"ac-atl-loader",src:`${t}images/atlassian-icon.svg`}),n.a.createElement("div",null,"Loading data..."))}},224:function(e,t,a){"use strict";a.d(t,"a",(function(){return i}));var s=a(859),n=a(860),r=a(0);class i extends r.Component{constructor(e){super(e),this.state={errorDetails:this.props.errorDetails}}componentWillReceiveProps(e){this.setState({errorDetails:e.errorDetails})}render(){let e=[];Object(n.a)(this.state.errorDetails)?(Object.keys(this.state.errorDetails.errors).forEach(t=>{e.push(r.createElement("p",{className:"force-wrap"},r.createElement("b",null,t,":"),r.createElement("span",{className:"force-wrap",style:{marginLeft:"5px"}},this.state.errorDetails.errors[t])))}),this.state.errorDetails.errorMessages.forEach(t=>{e.push(r.createElement("p",{className:"force-wrap"},r.createElement("span",{className:"force-wrap",style:{marginLeft:"5px"}},t)))})):Object(n.b)(this.state.errorDetails)?this.state.errorDetails.errorMessages.forEach(t=>{e.push(r.createElement("p",{className:"force-wrap"},r.createElement("span",{className:"force-wrap",style:{marginLeft:"5px"}},t)))}):"object"===typeof this.state.errorDetails?Object.keys(this.state.errorDetails).forEach(t=>{e.push(r.createElement("p",{className:"force-wrap"},r.createElement("b",null,t,":"),r.createElement("span",{className:"force-wrap",style:{marginLeft:"5px"}},JSON.stringify(this.state.errorDetails[t]))))}):e.push(r.createElement("p",{className:"force-wrap"},this.state.errorDetails));const t=this.state.errorDetails.title?this.state.errorDetails.title:"Something went wrong";return r.createElement(s.a,{appearance:"warning",title:t,actions:[{text:"Dismiss",onClick:()=>{this.setState({errorDetails:void 0}),this.props.onDismissError()}}]},r.createElement("div",null,e))}}},225:function(e,t,a){"use strict";a.d(t,"a",(function(){return i}));var s=a(0),n=a(697),r=a(847);class i extends s.Component{constructor(e){super(e)}render(){return s.createElement(n.b,null,s.createElement(r.a,{heading:"Looks like you've gone offline",shouldCloseOnEscapePress:!1,shouldCloseOnOverlayClick:!1},s.createElement("p",{style:{color:"var(--vscode-foreground)!important"}},"This page will be available when you're back online.")))}}},239:function(e,t,a){"use strict";a.d(t,"a",(function(){return r}));var s=a(0);var n=a(122);class r extends s.Component{constructor(e){super(e),this._api=acquireVsCodeApi();const t=this.onMessageEvent.bind(this);window.addEventListener("message",t),this.initializeColors()}initializeColors(){const e=()=>{const e=document.body,t=getComputedStyle(e),a=e.style;let s=t.getPropertyValue("--vscode-editor-background").trim();a.setProperty("--vscode-editor-background--lighten-05",Object(n.c)(s,5)),a.setProperty("--vscode-editor-background--darken-05",Object(n.b)(s,5)),a.setProperty("--vscode-editor-background--lighten-075",Object(n.c)(s,7.5)),a.setProperty("--vscode-editor-background--darken-075",Object(n.b)(s,7.5)),a.setProperty("--vscode-editor-background--lighten-15",Object(n.c)(s,15)),a.setProperty("--vscode-editor-background--darken-15",Object(n.b)(s,15)),a.setProperty("--vscode-editor-background--lighten-30",Object(n.c)(s,30)),a.setProperty("--vscode-editor-background--darken-30",Object(n.b)(s,30)),s=t.getPropertyValue("--color").trim(),a.setProperty("--color--75",Object(n.d)(s,75)),a.setProperty("--color--50",Object(n.d)(s,50)),s=t.getPropertyValue("--vscode-editor-foreground").trim(),a.setProperty("--vscode-editor-foreground--75",Object(n.d)(s,75)),a.setProperty("--vscode-editor-foreground--50",Object(n.d)(s,50)),s=t.getPropertyValue("--vscode-editor-background").trim(),a.setProperty("--vscode-editor-background--lighten-05",Object(n.c)(s,5)),a.setProperty("--vscode-editor-background--darken-05",Object(n.b)(s,5)),s=t.getPropertyValue("--vscode-button-foreground").trim(),a.setProperty("--vscode-button-foreground--75",Object(n.d)(s,75)),a.setProperty("--vscode-button-foreground--50",Object(n.d)(s,50)),s=t.getPropertyValue("--vscode-button-background").trim(),a.setProperty("--vscode-button-background--lighten-05",Object(n.c)(s,5)),a.setProperty("--vscode-button-background--lighten-50",Object(n.c)(s,50)),a.setProperty("--vscode-button-background--lighten-75",Object(n.c)(s,75)),a.setProperty("--vscode-button-background--lighten-80",Object(n.c)(s,80)),a.setProperty("--vscode-button-background--darken-05",Object(n.b)(s,5)),a.setProperty("--vscode-button-background--50",Object(n.d)(s,50)),a.setProperty("--vscode-button-background--75",Object(n.d)(s,75))};new MutationObserver(e).observe(document.body,{attributes:!0,attributeFilter:["class"]}),e()}onPMFLater(){this._api.postMessage({action:"pmfLater"})}onPMFNever(){this._api.postMessage({action:"pmfNever"})}onPMFSubmit(e){this._api.postMessage({action:"pmfSubmit",pmfData:e})}onPMFOpen(){this._api.postMessage({action:"pmfOpen"})}onMessageEvent(e){const t=e.data;this.onMessageReceived(t)}postMessage(e){this._api.postMessage(e)}postMessageWithEventPromise(e,t,a,s){return this._api.postMessage(e),function(e,t,a){return new Promise((s,n)=>{const r=setTimeout(()=>{window.removeEventListener("message",i),clearTimeout(r),n(`timeout waiting for event ${e}`)},t),i=t=>{t.data.type!==e||a&&t.data.nonce!==a||(clearTimeout(r),window.removeEventListener("message",i),s(t.data)),"error"===t.data.type&&a&&t.data.nonce===a&&(window.removeEventListener("message",i),clearTimeout(r),n(t.data.reason))};window.addEventListener("message",i)})}(t,a,s)}}},407:function(e,t,a){"use strict";a.d(t,"a",(function(){return c}));var s=a(0),n=a(851),r=a(519),i=a(408),o=a.n(i);class c extends s.Component{render(){return s.createElement("div",{className:"ac-icon-with-text"},this.props.iconUrl&&s.createElement("img",{style:{paddingRight:"5px"},src:this.props.iconUrl}),s.createElement("div",{className:"jira-issue-key"},s.createElement(n.a,{className:"ac-link-button",appearance:"link",spacing:"none",href:this.props.href,onClick:this.props.onItemClick},this.props.text),this.props.onCopy&&s.createElement("div",{className:"jira-issue-copy-icon",onClick:this.props.onCopy},s.createElement(r.a,{content:"Copy the web link to clipboard"},s.createElement(o.a,{label:"copy issue link",size:"small"})))))}}},409:function(e,t,a){"use strict";a.d(t,"a",(function(){return m}));var s=a(521),n=a(202),r=a(826),i=a(690),o=a(0),c=a(122);const{Option:l}=n.z,u=e=>o.createElement(l,Object.assign({},e),o.createElement(s.a,{appearance:c.a[e.data.to.statusCategory.colorName]},e.data.to.name)),d=e=>o.createElement(l,Object.assign({},e),`${e.data.name} \u2192 `,o.createElement(s.a,{appearance:c.a[e.data.to.statusCategory.colorName]},e.data.to.name)),p=e=>o.createElement(n.z.SingleValue,Object.assign({},e),o.createElement(s.a,{appearance:c.a[e.data.to.statusCategory.colorName]},e.data.to.name));class m extends o.Component{constructor(e){super(e),this.handleStatusChange=e=>{this.props.onStatusChange(e)};const t=this.getCurrentTransition(e.currentStatus,e.transitions);this.state={selectedTransition:t,showTransitionName:this.shouldShowTransitionName(e.transitions)}}componentWillReceiveProps(e){const t=this.getCurrentTransition(e.currentStatus,e.transitions);this.setState({selectedTransition:t,showTransitionName:this.shouldShowTransitionName(e.transitions)})}getCurrentTransition(e,t){const a=t.find(t=>t.to.id===e.id);return void 0!==a?a:Object.assign(Object.assign({},i.e),{to:e})}shouldShowTransitionName(e){return e.some(e=>e.name!==e.to.name)}render(){return!Array.isArray(this.props.transitions)||this.props.transitions.length<1?o.createElement("div",null):o.createElement(r.a,{name:"status",id:"status",className:"ac-select-container",classNamePrefix:"ac-select",options:this.props.transitions,value:this.state.selectedTransition,components:{Option:this.state.showTransitionName?d:u,SingleValue:p},getOptionLabel:e=>e.to.name,getOptionValue:e=>e.id,isDisabled:this.props.isStatusButtonLoading,isLoading:this.props.isStatusButtonLoading,onChange:this.handleStatusChange})}}},417:function(e,t,a){"use strict";a.d(t,"b",(function(){return c})),a.d(t,"a",(function(){return l})),a.d(t,"d",(function(){return u})),a.d(t,"c",(function(){return d})),a.d(t,"e",(function(){return p})),a.d(t,"f",(function(){return m}));var s=a(493),n=a(690),r=a(615),i=a(195),o=a(98);const c=Object.assign(Object.assign({type:""},Object(s.a)(o.f)),{currentUser:n.f,workInProgress:!1,recentPullRequests:[]}),l=Object.assign(Object.assign({type:""},Object(i.createEmptyIssueTypeUI)(o.f)),{currentUser:n.f,transformerProblems:{}});function u(e){return void 0!==e.fieldValues}function d(e){return void 0!==e.issueData}function p(e){return void 0!==e.issue&&Object(r.d)(e.issue)}function m(e){return"startWorkOnIssueResult"===e.type}},62:function(e,t,a){"use strict";a.r(t),a.d(t,"default",(function(){return T}));var s=a(797),n=a(714),r=a(851),i=a(520),o=a(648),c=a(446),l=a(647),u=a(595),d=a(859),p=a(826),m=a(619),h=a(690),b=a(615),g=a(473),f=a(0),E=a(351),v=a(98),y=a(206);var k=a(417),O=a(222),S=a(224),C=a(135),N=a(225),w=a(239),B=a(407),j=a(409);const x={workspaceRepo:{rootUri:"",mainSiteRemote:{site:y.b,remote:{name:"",isReadOnly:!0}},siteRemotes:[]},localBranches:[],remoteBranches:[],branchTypes:[],isCloud:!0},I={data:{type:"update",issue:Object(h.a)(v.f),repoData:[]},issueType:"jiraIssue",jiraSetupEnabled:!0,bitbucketSetupEnabled:!0,transition:h.e,repo:x,localBranch:void 0,existingBranchOptions:[],isStartButtonLoading:!1,result:{type:"startWorkOnIssueResult",successMessage:void 0,error:void 0},isErrorBannerOpen:!1,errorDetails:void 0,isOnline:!0};class T extends w.a{constructor(e){super(e),this.isEmptyRepo=e=>e===x,this.handleStatusChange=e=>{Object(k.e)(this.state.data)&&this.setState({data:Object.assign(Object.assign({},this.state.data),{issue:Object.assign(Object.assign({},this.state.data.issue),{status:Object.assign(Object.assign({},this.state.data.issue.status),{id:e.to.id,name:e.to.name})})}),transition:e})},this.handleRepoChange=e=>{const t=Object(k.e)(this.state.data)?this.state.data.issue.key:`issue-#${this.state.data.issue.data.id}`,a=e.localBranches.find(t=>void 0!==t.name&&-1!==t.name.indexOf(e.developmentBranch));this.setState({repo:e,sourceBranch:a,branchType:e.branchTypes.length>0?e.branchTypes[0]:void 0,existingBranchOptions:this.getExistingBranchOptions(e,t)})},this.handleSourceBranchChange=e=>{this.setState({sourceBranch:e})},this.handleBranchNameChange=e=>{this.setState({localBranch:e})},this.handleSelectExistingBranch=e=>{const t=this.state.repo.branchTypes.find(t=>e.startsWith(t.prefix));this.setState({branchType:t,localBranch:t?e.substring(t.prefix.length):e})},this.toggleJiraSetupEnabled=e=>{this.setState({jiraSetupEnabled:e.target.checked})},this.toggleBitbucketSetupEnabled=e=>{this.setState({bitbucketSetupEnabled:e.target.checked})},this.handleSiteRemoteChange=e=>{this.setState({siteRemote:e})},this.handleStart=()=>{this.setState({isStartButtonLoading:!0});let e="";if(this.state.localBranch){e=(this.state.branchType?this.state.branchType.prefix:"")+this.state.localBranch}this.postMessage({action:"startWork",repoUri:this.state.repo.workspaceRepo.rootUri,targetBranchName:e,sourceBranch:this.state.sourceBranch,remoteName:this.state.siteRemote?this.state.siteRemote.remote.name:"",transition:this.state.transition,setupJira:this.state.jiraSetupEnabled,setupBitbucket:!this.isEmptyRepo(this.state.repo)&&this.state.bitbucketSetupEnabled})},this.handleDismissError=()=>{this.setState({isErrorBannerOpen:!1,errorDetails:void 0})},this.state=I}onMessageReceived(e){switch(e.type){case"error":this.setState({isStartButtonLoading:!1,isErrorBannerOpen:!0,errorDetails:e.reason});break;case"update":if(Object(k.e)(e)&&e.issue.key.length>0){const t=this.isEmptyRepo(this.state.repo)&&e.repoData.length>0?e.repoData[0]:this.state.repo,a=this.state.transition===h.e&&e.issue.transitions.find(t=>t.to.id===e.issue.status.id)||this.state.transition,s="jiraIssue",n=e.issue.key,r=e.issue.summary;this.updateState(e,s,t,n,r,a)}else this.setState(I);break;case"startWorkOnBitbucketIssueData":if("startWorkOnBitbucketIssueData"===e.type){let t=this.state.repo;if(this.isEmptyRepo(this.state.repo)&&e.repoData.length>0){t=e.repoData.find(t=>t.href===e.issue.data.repository.links.html.href)||e.repoData[0]}const a="bitbucketIssue",s=`issue-#${e.issue.data.id.toString()}`,n=e.issue.data.title;this.updateState(e,a,t,s,n,h.e)}else this.setState(I);break;case"startWorkOnIssueResult":Object(k.f)(e)&&this.setState({isStartButtonLoading:!1,result:e,isErrorBannerOpen:!1,errorDetails:void 0});break;case"onlineStatus":this.setState({isOnline:e.isOnline}),e.isOnline&&this.postMessage({action:"refreshIssue"})}return!0}getExistingBranchOptions(e,t){return[...e.localBranches.filter(e=>e.name.toLowerCase().includes(t.toLowerCase())).map(e=>e.name),...e.remoteBranches.filter(e=>e.name.toLowerCase().includes(t.toLowerCase())).filter(t=>!e.localBranches.some(e=>t.name.endsWith(e.name))).map(e=>e.name.replace(`${e.remote}/`,""))]}updateState(e,t,a,s,n,r){const i=this.state.existingBranchOptions.length>0?this.state.existingBranchOptions:this.getExistingBranchOptions(a,s),o=this.state.localBranch||`${s}-${n.substring(0,50).trim().toLowerCase().replace(/\W+/g,"-")}`,c=this.state.sourceBranch||a.localBranches.find(e=>void 0!==e.name&&-1!==e.name.indexOf(a.developmentBranch))||a.localBranches[0];let l=this.state.siteRemote;this.state.siteRemote||(l=a.workspaceRepo.mainSiteRemote),this.setState({data:e,issueType:t,repo:a,sourceBranch:c,transition:r,existingBranchOptions:i,localBranch:o,branchType:a.branchTypes.length>0?a.branchTypes[0]:void 0,siteRemote:l,bitbucketSetupEnabled:!this.isEmptyRepo(a)&&this.state.bitbucketSetupEnabled,isErrorBannerOpen:!1,errorDetails:void 0})}render(){if(Object(k.e)(this.state.data)&&""===this.state.data.issue.key&&!this.state.isErrorBannerOpen&&this.state.isOnline)return this.postMessage({action:"refreshIssue"}),f.createElement(O.a,null);const e=this.state.data.issue,t=this.state.repo,a=f.createElement("div",{className:"ac-vpadding"},f.createElement("p",null,f.createElement("strong",null,"Tip:")," You can have issue keys auto-added to your commit messages using"," ",f.createElement("a",{type:"button",className:"ac-link-button",href:"https://bitbucket.org/snippets/atlassian/qedp7d"},f.createElement("span",null,"our prepare-commit-msg hook"))));let h=f.createElement(o.a,{medium:8},f.createElement("em",null,f.createElement("p",null,"Start work on:")));if("jiraIssue"===this.state.issueType&&Object(b.d)(e))h=f.createElement(o.a,{medium:8},f.createElement("em",null,f.createElement("p",null,"Start work on:")),f.createElement(u.a,{actions:void 0,breadcrumbs:f.createElement(s.a,{onExpand:()=>{}},e.parentKey&&f.createElement(n.a,{component:()=>f.createElement(B.a,{text:`${e.parentKey}`,onItemClick:()=>this.postMessage({action:"openJiraIssue",issueOrKey:{siteDetails:e.siteDetails,key:e.parentKey}})})}),f.createElement(n.a,{component:()=>f.createElement(B.a,{text:`${e.key}`,iconUrl:e.issuetype.iconUrl,onItemClick:()=>this.postMessage({action:"openJiraIssue",issueOrKey:e}),onCopy:()=>this.postMessage({action:"copyJiraIssueLink"})})}))},f.createElement("p",null,e.summary)),f.createElement("p",{dangerouslySetInnerHTML:{__html:e.descriptionHtml}}));else if("bitbucketIssue"===this.state.issueType){const t=e;h=f.createElement(o.a,{medium:8},f.createElement("em",null,f.createElement("p",null,"Start work on:")),f.createElement(u.a,{actions:void 0,breadcrumbs:f.createElement(s.a,{onExpand:()=>{}},f.createElement(n.a,{component:()=>f.createElement(B.a,{text:t.data.repository.name,href:t.data.repository.links.html.href})}),f.createElement(n.a,{component:()=>f.createElement(B.a,{text:"Issues",href:`${t.data.repository.links.html.href}/issues`})}),f.createElement(n.a,{component:()=>f.createElement(B.a,{text:`Issue #${t.data.id}`,onItemClick:()=>this.postMessage({action:"openBitbucketIssue",issue:t}),onCopy:()=>this.postMessage({action:"copyBitbucketIssueLink"})})}))},f.createElement("p",null,t.data.title)),f.createElement("p",{dangerouslySetInnerHTML:{__html:t.data.content.html}}))}return f.createElement(c.a,null,f.createElement(l.a,null,f.createElement(o.a,{medium:8},!this.state.isOnline&&f.createElement(N.a,null),this.state.result.successMessage&&f.createElement(d.a,{appearance:"confirmation",title:"Work Started"},f.createElement("div",{className:"start-work-success"},f.createElement("p",{dangerouslySetInnerHTML:{__html:this.state.result.successMessage}}))),this.state.isErrorBannerOpen&&f.createElement(S.a,{onDismissError:this.handleDismissError,errorDetails:this.state.errorDetails})),h,"jiraIssue"===this.state.issueType&&f.createElement(o.a,{medium:6},f.createElement("div",{style:{display:"flex",alignItems:"center"}},f.createElement(i.a,{isChecked:this.state.jiraSetupEnabled,onChange:this.toggleJiraSetupEnabled,name:"setup-jira-checkbox"}),f.createElement("h4",null,"Transition issue")),this.state.jiraSetupEnabled&&f.createElement("div",{style:{margin:10,borderLeftWidth:"initial",borderLeftStyle:"solid",borderLeftColor:"var(--vscode-settings-modifiedItemIndicator)"}},f.createElement("div",{style:{margin:10}},f.createElement("label",null,"Select new status"),f.createElement(j.a,{transitions:e.transitions,currentStatus:e.status,isStatusButtonLoading:!1,onStatusChange:this.handleStatusChange})))),f.createElement(o.a,{medium:12}),f.createElement(o.a,{medium:8},f.createElement("div",{style:{display:"flex",alignItems:"center"}},f.createElement(i.a,{isChecked:this.state.bitbucketSetupEnabled,onChange:this.toggleBitbucketSetupEnabled,name:"setup-bitbucket-checkbox"}),f.createElement("h4",null,"Set up git branch")),this.isEmptyRepo(t)&&f.createElement("div",{style:{margin:10,borderLeftWidth:"initial",borderLeftStyle:"solid",borderLeftColor:"var(--vscode-settings-modifiedItemIndicator)"}},f.createElement("div",{style:{margin:10}},f.createElement("div",{className:"ac-vpadding"},f.createElement("label",null,"Repository"),f.createElement(p.a,{className:"ac-select-container",classNamePrefix:"ac-select",placeholder:"No repositories found...",value:t})))),this.state.bitbucketSetupEnabled&&!this.isEmptyRepo(this.state.repo)&&f.createElement("div",{style:{margin:10,borderLeftWidth:"initial",borderLeftStyle:"solid",borderLeftColor:"var(--vscode-settings-modifiedItemIndicator)"}},f.createElement("div",{style:{margin:10}},this.state.data.repoData.length>1&&f.createElement("div",{className:"ac-vpadding"},f.createElement("label",null,"Repository"),f.createElement(p.a,{className:"ac-select-container",classNamePrefix:"ac-select",options:this.state.data.repoData,getOptionLabel:e=>this.isEmptyRepo(e)?"No repositories found...":g.basename(e.workspaceRepo.rootUri),getOptionValue:e=>e,onChange:this.handleRepoChange,placeholder:"Loading...",value:t})),t.branchTypes.length>0&&f.createElement("div",{className:"ac-vpadding",style:{textTransform:"capitalize"}},f.createElement("label",null,"Type"),f.createElement(m.a,{className:"ac-select-container",classNamePrefix:"ac-select",options:t.branchTypes,getOptionLabel:e=>e.kind,getOptionValue:e=>e.prefix,onChange:e=>{this.setState({branchType:e})},value:this.state.branchType})),f.createElement("div",{className:"ac-vpadding"},f.createElement("label",null,"Source branch (this will be the start point for the new branch)"),f.createElement(p.a,{className:"ac-select-container",classNamePrefix:"ac-select",options:[...t.localBranches,...t.remoteBranches],getOptionLabel:e=>e.name,getOptionValue:e=>e,onChange:this.handleSourceBranchChange,value:this.state.sourceBranch})),f.createElement("div",{className:"ac-vpadding"},f.createElement("label",null,"Local branch"),f.createElement("div",{className:"branch-container"},this.state.branchType&&this.state.branchType.prefix&&f.createElement("div",{className:"prefix-container"},f.createElement("label",null,this.state.branchType.prefix)),f.createElement("div",{className:"branch-name"},f.createElement(E.a,{type:"text",value:this.state.localBranch||"",onSave:this.handleBranchNameChange,validation:C.e,validationMessage:"Branch name is required",inputProps:{className:"ac-inputField"},viewProps:{id:"start-work-branch-name",className:"ac-inline-input-view-p"},editButtonClassName:"ac-inline-edit-button",cancelButtonClassName:"ac-inline-cancel-button",saveButtonClassName:"ac-inline-save-button",editOnViewClick:!0}))),this.state.existingBranchOptions.length>0&&f.createElement(d.a,{appearance:"change",title:"Use an existing branch?"},f.createElement("div",null,f.createElement("p",null,"Click to use an existing branch for this issue: (",f.createElement("em",null,"source branch selection is ignored for existing branches"),")"),f.createElement("ul",null,this.state.existingBranchOptions.map(e=>f.createElement("li",null,f.createElement(r.a,{className:"ac-link-button",appearance:"link",onClick:()=>this.handleSelectExistingBranch(e)},e))))))),t.workspaceRepo.siteRemotes.length>1&&f.createElement("div",null,f.createElement("label",null,"Set upstream to"),f.createElement(p.a,{className:"ac-select-container",classNamePrefix:"ac-select",options:t.workspaceRepo.siteRemotes,getOptionLabel:e=>e.remote.name,getOptionValue:e=>e,onChange:this.handleSiteRemoteChange,value:this.state.siteRemote}))))),f.createElement(o.a,{medium:12},f.createElement("div",{className:"ac-vpadding"},!this.state.result.successMessage&&f.createElement(r.a,{className:"ac-button",isLoading:this.state.isStartButtonLoading,onClick:this.handleStart},"Start")),a)))}}},98:function(e,t,a){"use strict";var s;a.d(t,"b",(function(){return n})),a.d(t,"a",(function(){return r})),a.d(t,"g",(function(){return o})),a.d(t,"f",(function(){return c})),a.d(t,"c",(function(){return l})),a.d(t,"d",(function(){return u})),a.d(t,"e",(function(){return d})),function(e){e.Update="update",e.Remove="remove"}(s||(s={}));const n={name:"Jira",key:"jira"},r={name:"Bitbucket",key:"bitbucket"};var i;!function(e){e.BitbucketCloud="bbcloud",e.BitbucketCloudStaging="bbcloudstaging",e.JiraCloud="jiracloud",e.JiraCloudStaging="jiracloudstaging"}(i||(i={}));const o={id:"",displayName:"",email:"",avatarUrl:""},c={id:"",name:"",avatarUrl:"",host:"",baseLinkUrl:"",baseApiUrl:"",product:{name:"",key:""},isCloud:!0,userId:"",credentialId:""},l={id:"",name:"",avatarUrl:"",scopes:[],baseUrlSuffix:"atlassian.net"},u={user:o},d={user:o,username:"",password:""}}}]);