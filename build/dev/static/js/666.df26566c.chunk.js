"use strict";(self.webpackChunkweather_app=self.webpackChunkweather_app||[]).push([[666],{8666:function(e,n,r){r.r(n),r.d(n,{default:function(){return m}});var t=r(1413),u=r(9439),o=r(3433),a=r(7313),c=r(3696),i=r(7290),l=r(5566),s=r(8513),d=r(377),f=r(6417),p={maxZoom:20,minZoom:2,closePopupOnClick:!1,maxBounds:[[84.9593,-200],[-85.0321,200]]};function m(e){var n=e.center,r=void 0===n?[1,1]:n,m=e.startZoom,v=void 0===m?4:m,h=e.mapInitConfig,w=void 0===h?{}:h,N=e.addClassName,k=void 0===N?[""]:N,Z=e.isFlyToAnim,x=void 0===Z?"auto":Z,F=[].concat((0,o.Z)(k),["TwoGisMaps_wrapper"]).join(" "),T=(0,a.useRef)(!1),b=(0,a.useId)(),g=(0,a.useState)(null),y=(0,u.Z)(g,2),C=y[0],G=y[1],P=(0,i.N)((function(e){return e.weatherGeo})),j=P.lat,M=P.lon,R=P.cityName,V=(0,a.useRef)(null),_=(0,a.useRef)(null),E=(0,i.i)(),I=function(e){var n=Number(e.latlng.lat.toFixed(3)),r=Number(e.latlng.lng.toFixed(3));_.current&&_.current.getPopup().isOpen()?_.current.closePopup():(E((0,l.Uy)(!1)),E((0,l.$Q)({lat:n,lon:r,cityName:s.Vh})))};(0,a.useEffect)((function(){T.current||(T.current=!0,G(new c.Map(b,(0,t.Z)((0,t.Z)({},p),{},{center:r,zoom:v},w))))}),[]),(0,a.useEffect)((function(){return C&&C.on("click",I),function(){C&&T.current&&(T.current=!0,C.remove(),G(null))}}),[C]);return function(){if(j&&M&&C){var e=c.featureGroup();null!==V.current&&V.current.removeFrom(C),V&&(_.current=c.marker([j,M]),_.current.addTo(e),_.current.bindPopup(R&&R!==s.Vh?R:R&&R==s.Vh?"\u041f\u043e\u0433\u043e\u0434\u0430 \u0434\u043b\u044f \u044d\u0442\u043e\u0439 \u0442\u043e\u0447\u043a\u0438":""),V.current=e,e.addTo(C)),C.flyTo([j,M],14,{duration:3,animate:"auto"==x?!(0,d.FF)():"true"==x})}}(),(0,f.jsx)("div",{className:F,children:(0,f.jsx)("div",{id:b,className:"TwoGisMaps"})})}}}]);