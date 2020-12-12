(this["webpackJsonpws-mast-comparator"]=this["webpackJsonpws-mast-comparator"]||[]).push([[0],{15:function(e,t,a){},16:function(e,t,a){},17:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a(1),r=a.n(l),i=a(9),s=a.n(i),o=(a(15),a(2)),c=a(7),h=a(6),u=a(3),m=a(4),p=(a(16),a(5));p.forEach((function(e){return e.year=2019}));var f=function(){function e(t,a,n){Object(u.a)(this,e),this.min=t,this.max=a,this.className=n}return Object(m.a)(e,[{key:"includes",value:function(e){return e>=this.min&&e<=this.max}},{key:"getTypical",value:function(){return(this.min+this.max)/2}}],[{key:"getClassOf",value:function(e){return this.All.find((function(t){return t.includes(e)}))}},{key:"getClassNameOf",value:function(e){var t=this.getClassOf(e);return t?t.className:void 0}}]),e}();f.HardTop=new f(1,5,"hard-top"),f.ConstantCurve=new f(6,10,"constant-curve"),f.FlexTop=new f(11,15,"flex-top"),f.All=[f.HardTop,f.ConstantCurve,f.FlexTop];var d=function(e){Object(c.a)(a,e);var t=Object(h.a)(a);function a(e){var n;return Object(u.a)(this,a),(n=t.call(this,e)).state={comparedMasts:[],highlightedProfile:void 0},n}return Object(m.a)(a,[{key:"render",value:function(){return Object(n.jsxs)("div",{children:[Object(n.jsx)("h1",{children:"Windsurfing Mast Comparator"}),Object(n.jsxs)("table",{children:[Object(n.jsx)(j,{comparator:this}),Object(n.jsxs)("tbody",{children:[Object(n.jsx)(v,{masts:this.state.comparedMasts,comparator:this}),Object(n.jsx)(g,{comparator:this}),Object(n.jsx)(b,{comparator:this}),Object(n.jsx)(O,{comparator:this})]})]})]})}},{key:"compare",value:function(e){var t={comparedMasts:this.state.comparedMasts.concat([e])};t.highlightedProfile=t.comparedMasts[0].profile,this.setState(t)}},{key:"remove",value:function(e){var t={comparedMasts:this.state.comparedMasts.filter((function(t){return t!==e}))};t.highlightedProfile=t.comparedMasts.length>0?t.comparedMasts[0].profile:void 0,this.setState(t)}},{key:"removeAll",value:function(){this.setState({comparedMasts:[],highlightedProfile:void 0})}},{key:"isCompared",value:function(e){return this.state.comparedMasts.includes(e)}},{key:"isAnyCompared",value:function(){return this.state.comparedMasts.length>0}},{key:"isHighlighted",value:function(e){return this.state.highlightedProfile===e}},{key:"isHighlightedClass",value:function(e){return e.includes(this.state.highlightedProfile)}},{key:"sortProfileFirst",value:function(e){var t=this;p.sort((function(a,n){return t.compareToProfile(a,n,e)})),this.isAnyCompared()?this.forceUpdate():this.setState({highlightedProfile:e})}},{key:"getProfileClassName",value:function(e){var t=f.getClassNameOf(e);return this.isHighlighted(e)&&(t+=" highlighted"),t}},{key:"sortByName",value:function(e){p.sort(e),this.isAnyCompared()?this.forceUpdate():this.setState({highlightedProfile:void 0})}},{key:"sortByNameDescending",value:function(){var e=this;this.sortByName((function(t,a){return-1*e.compareMastName(t,a)}))}},{key:"sortByNameAscending",value:function(){this.sortByName(this.compareMastName)}},{key:"compareToMast",value:function(e,t,a){return e===a?-1:t===a?1:this.compareToProfile(e,t,a.profile)}},{key:"compareToProfile",value:function(e,t,a){var n=Math.abs(e.profile-a)-Math.abs(t.profile-a);return 0===n?this.compareMastName(e,t):n}},{key:"compareMastName",value:function(e,t){return e.name<t.name?-1:e.name>t.name?1:0}}]),a}(r.a.Component);function j(e){var t=e.comparator,a=function(e){var a=e.className;return t.isHighlightedClass(e)&&(a+=" highlighted"),a};return Object(n.jsx)("thead",{children:Object(n.jsxs)("tr",{children:[Object(n.jsx)("th",{children:"Producer"}),Object(n.jsx)("th",{children:"Year"}),Object(n.jsx)("th",{children:"Size"}),Object(n.jsx)("th",{children:"Length"}),Object(n.jsx)("th",{colSpan:"5",className:a(f.HardTop),children:Object(n.jsx)("span",{title:"Sort hard top first",className:"clickable",onClick:function(){return t.sortProfileFirst(f.HardTop.getTypical())},children:"Hard top"})}),Object(n.jsx)("th",{colSpan:"5",className:a(f.ConstantCurve),children:Object(n.jsx)("span",{title:"Sort constant curve first",className:"clickable",onClick:function(){return t.sortProfileFirst(f.ConstantCurve.getTypical())},children:"Constant curve"})}),Object(n.jsx)("th",{colSpan:"5",className:a(f.FlexTop),children:Object(n.jsx)("span",{title:"Sort flex top first",className:"clickable",onClick:function(){return t.sortProfileFirst(f.FlexTop.getTypical())},children:"Flex Top"})})]})})}var g=function(e){Object(c.a)(a,e);var t=Object(h.a)(a);function a(){return Object(u.a)(this,a),t.apply(this,arguments)}return Object(m.a)(a,[{key:"render",value:function(){return Object(n.jsx)("td",{colspan:"19",style:{"text-align":"left"},children:this.props.comparator.isAnyCompared()?this.renderNonEmpty():this.renderEmpty()})}},{key:"renderEmpty",value:function(){return Object(n.jsx)("span",{children:"Use the \u271a icon next to a producer name to add the mast to the comparison."})}},{key:"renderNonEmpty",value:function(){var e=this;return Object(n.jsx)("button",{onClick:function(){return e.props.comparator.removeAll()},children:"Remove all compared masts above."})}}]),a}(r.a.Component),b=function(e){Object(c.a)(a,e);var t=Object(h.a)(a);function a(){return Object(u.a)(this,a),t.apply(this,arguments)}return Object(m.a)(a,[{key:"render",value:function(){var e=this.props.comparator;return Object(n.jsxs)("tr",{children:[Object(n.jsxs)("td",{className:"header",children:["Producer",Object(n.jsx)("span",{title:"Sort ascending by producer name",className:"clickable left-padded",onClick:function(){return e.sortByNameAscending()},children:"\u25b2"}),Object(n.jsx)("span",{title:"Sort descending by producer name",className:"clickable",onClick:function(){return e.sortByNameDescending()},children:"\u25bc"})]}),Object(n.jsx)("td",{className:"header",children:"Year"}),Object(n.jsx)("td",{className:"header",children:"Size"}),Object(n.jsx)("td",{className:"header",children:"Length"}),this.getProfileColumns()]})}},{key:"getProfileColumns",value:function(){for(var e=this,t=this.props.comparator,a=Array(15),l=function(l){a[l-1]=Object(n.jsx)("td",Object(o.a)(Object(o.a)({},e.props),{},{className:t.getProfileClassName(l),children:Object(n.jsx)("span",{title:"Sort this profile first",className:"clickable",onClick:function(){return t.sortProfileFirst(l)},children:"\u25bc"})}))},r=1;r<=a.length;r++)l(r);return a}}]),a}(r.a.Component);function v(e){var t=e.comparator;return e.masts.map((function(a){return Object(n.jsx)(M,Object(o.a)(Object(o.a)({},e),{},{mast:a,buttons:(l=a,[Object(n.jsx)("span",{title:"Remove from comparison",className:"clickable",onClick:function(){return t.remove(l)},children:"\u2716"})])}));var l}))}function O(e){var t=e.comparator;return p.filter((function(e){return!t.isCompared(e)})).map((function(a){return Object(n.jsx)(M,Object(o.a)(Object(o.a)({},e),{},{mast:a,buttons:(l=a,[Object(n.jsx)("span",{title:"Add to comparison",className:"clickable",onClick:function(){return t.compare(l)},children:"\u271a"})])}));var l}))}function M(e){return Object(n.jsxs)("tr",{children:[Object(n.jsxs)("td",{className:"mast-name",children:[e.buttons,Object(n.jsx)("span",{className:"left-padded",children:e.mast.name})]}),Object(n.jsx)("td",{children:e.mast.year}),Object(n.jsx)("td",{children:e.mast.size}),Object(n.jsx)("td",{children:e.mast.length}),Object(n.jsx)(S,Object(o.a)({},e))]})}var S=function(e){Object(c.a)(a,e);var t=Object(h.a)(a);function a(){return Object(u.a)(this,a),t.apply(this,arguments)}return Object(m.a)(a,[{key:"render",value:function(){var e=this;return this.calculateColumnValues(this.props.mast.profile).map((function(t,a){return e.renderColumn(a+1,t)}))}},{key:"renderColumn",value:function(e,t){var a=this.props.comparator;return Object(n.jsx)("td",{className:a.getProfileClassName(e),children:t?this.renderClickableMark((function(){return a.sortProfileFirst(e)})):""})}},{key:"renderClickableMark",value:function(e){return Object(n.jsx)("span",{className:"clickable",onClick:e,children:"\u25cf"})}},{key:"calculateColumnValues",value:function(e){for(var t=new Array(15),a=0;a<t.length;a++)t[a]=Math.abs(e-(a+1))<=1;return t}}]),a}(r.a.Component);s.a.render(Object(n.jsx)(d,{}),document.getElementById("root"))},5:function(e){e.exports=JSON.parse('[{"name":"Aerotech","size":"RDM","length":"all","profile":8},{"name":"Aerotech","size":"SDM","length":"all","profile":7},{"name":"Attitude Sails","size":"RDM","length":"all","profile":13},{"name":"Attitude Sails","size":"SDM","length":"all","profile":13},{"name":"Avanti Sails","size":"RDM","length":"all","profile":3},{"name":"Avanti Sails","size":"SDM","length":"all","profile":9},{"name":"Bull Sails","size":"RDM","length":"all","profile":8},{"name":"Challenger Sails","size":"RDM","length":"all","profile":11},{"name":"Challenger Sails","size":"SDM","length":"all","profile":10},{"name":"Duotone","size":"RDM","length":"all","profile":8},{"name":"Duotone","size":"SDM","length":"all","profile":9},{"name":"Ezzy Sails","size":"RDM","length":"all","profile":9},{"name":"Ezzy Sails","size":"SDM","length":"all","profile":9},{"name":"Gaastra/GA","size":"RDM","length":"all","profile":7},{"name":"Gaastra/GA","size":"SDM","length":"all","profile":7},{"name":"Goya Sails","size":"RDM","length":"<430","profile":11},{"name":"Goya Sails","size":"RDM","length":">460","profile":8},{"name":"Gun Sails","size":"RDM","length":"all","profile":8},{"name":"Gun Sails","size":"SDM","length":"all","profile":8},{"name":"Hot Sails","size":"RDM","length":"all","profile":11},{"name":"KA Sails","size":"RDM","length":"all","profile":9},{"name":"KA Sails","size":"SDM","length":"all","profile":9},{"name":"Loft Sails","size":"RDM","length":"all","profile":8},{"name":"Loft Sails","size":"SDM","length":"all","profile":8},{"name":"Maui Sails","size":"RDM","length":"all","profile":7},{"name":"Maui Sails","size":"SDM","length":"all","profile":7},{"name":"Naish","size":"RDM","length":"all","profile":7},{"name":"Naish","size":"SDM","length":"all","profile":7},{"name":"Neil Pryde","size":"RDM","length":"all","profile":12},{"name":"Neil Pryde","size":"SDM","length":"all","profile":13},{"name":"Point-7","size":"RDM","length":"all","profile":6},{"name":"Point-7","size":"SDM","length":"<430","profile":3},{"name":"Point-7","size":"SDM","length":">460","profile":8},{"name":"RRD","size":"RDM","length":"all","profile":10},{"name":"RRD","size":"SDM","length":"all","profile":10},{"name":"S2 Maui","size":"RDM","length":"all","profile":7},{"name":"S2 Maui","size":"SDM","length":"all","profile":7},{"name":"Sailloft","size":"RDM","length":"all","profile":9},{"name":"Sailloft","size":"SDM","length":"all","profile":10},{"name":"Sailworks","size":"RDM","length":"all","profile":9},{"name":"Sailworks","size":"SDM","length":"all","profile":9},{"name":"Severne","size":"RDM","length":"all","profile":6},{"name":"Severne","size":"SDM","length":"all","profile":7},{"name":"Simmer Style","size":"RDM","length":"all","profile":11},{"name":"Simmer Style","size":"SDM","length":"all","profile":10},{"name":"Vandal Sails","size":"RDM","length":"all","profile":3},{"name":"Vandal Sails","size":"SDM","length":"all","profile":5},{"name":"XO Sails","size":"RDM","length":"all","profile":10},{"name":"XO Sails","size":"SDM","length":"all","profile":10}]')}},[[17,1,2]]]);
//# sourceMappingURL=main.1296edd3.chunk.js.map