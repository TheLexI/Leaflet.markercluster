!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(((e=e||self).Leaflet=e.Leaflet||{},e.Leaflet.markercluster={}))}(this,function(e){"use strict";window.noConflictLeafletCore=L;var t=window.noConflictLeafletCore.MarkerClusterGroup=window.noConflictLeafletCore.FeatureGroup.extend({options:{maxClusterRadius:80,iconCreateFunction:null,clusterPane:window.noConflictLeafletCore.Marker.prototype.options.pane,spiderfyOnMaxZoom:!0,showCoverageOnHover:!0,zoomToBoundsOnClick:!0,singleMarkerMode:!1,disableClusteringAtZoom:null,removeOutsideVisibleBounds:!0,animate:!0,animateAddingMarkers:!1,spiderfyShapePositions:null,spiderfyDistanceMultiplier:1,spiderLegPolylineOptions:{weight:1.5,color:"#222",opacity:.5},chunkedLoading:!1,chunkInterval:200,chunkDelay:50,chunkProgress:null,polygonOptions:{}},initialize:function(e){window.noConflictLeafletCore.Util.setOptions(this,e),this.options.iconCreateFunction||(this.options.iconCreateFunction=this._defaultIconCreateFunction),this._featureGroup=window.noConflictLeafletCore.featureGroup(),this._featureGroup.addEventParent(this),this._nonPointGroup=window.noConflictLeafletCore.featureGroup(),this._nonPointGroup.addEventParent(this),this._inZoomAnimation=0,this._needsClustering=[],this._needsRemoving=[],this._currentShownBounds=null,this._queue=[],this._childMarkerEventHandlers={dragstart:this._childMarkerDragStart,move:this._childMarkerMoved,dragend:this._childMarkerDragEnd};var t=window.noConflictLeafletCore.DomUtil.TRANSITION&&this.options.animate;window.noConflictLeafletCore.extend(this,t?this._withAnimation:this._noAnimation),this._markerCluster=t?window.noConflictLeafletCore.MarkerCluster:window.noConflictLeafletCore.MarkerClusterNonAnimated},addLayer:function(e){if(e instanceof window.noConflictLeafletCore.LayerGroup)return this.addLayers([e]);if(!e.getLatLng)return this._nonPointGroup.addLayer(e),this.fire("layeradd",{layer:e}),this;if(!this._map)return this._needsClustering.push(e),this.fire("layeradd",{layer:e}),this;if(this.hasLayer(e))return this;this._unspiderfy&&this._unspiderfy(),this._addLayer(e,this._maxZoom),this.fire("layeradd",{layer:e}),this._topClusterLevel._recalculateBounds(),this._refreshClustersIcons();var t=e,i=this._zoom;if(e.__parent)for(;t.__parent._zoom>=i;)t=t.__parent;return this._currentShownBounds.contains(t.getLatLng())&&(this.options.animateAddingMarkers?this._animationAddLayer(e,t):this._animationAddLayerNonAnimated(e,t)),this},removeLayer:function(e){return e instanceof window.noConflictLeafletCore.LayerGroup?this.removeLayers([e]):(e.getLatLng?this._map?e.__parent&&(this._unspiderfy&&(this._unspiderfy(),this._unspiderfyLayer(e)),this._removeLayer(e,!0),this.fire("layerremove",{layer:e}),this._topClusterLevel._recalculateBounds(),this._refreshClustersIcons(),e.off(this._childMarkerEventHandlers,this),this._featureGroup.hasLayer(e)&&(this._featureGroup.removeLayer(e),e.clusterShow&&e.clusterShow())):(!this._arraySplice(this._needsClustering,e)&&this.hasLayer(e)&&this._needsRemoving.push({layer:e,latlng:e._latlng}),this.fire("layerremove",{layer:e})):(this._nonPointGroup.removeLayer(e),this.fire("layerremove",{layer:e})),this)},addLayers:function(o,r){if(!window.noConflictLeafletCore.Util.isArray(o))return this.addLayer(o);var s,a=this._featureGroup,l=this._nonPointGroup,h=this.options.chunkedLoading,u=this.options.chunkInterval,_=this.options.chunkProgress,d=o.length,c=0,f=!0;if(this._map){var p=(new Date).getTime(),m=window.noConflictLeafletCore.bind(function(){var e=(new Date).getTime();for(this._map&&this._unspiderfy&&this._unspiderfy();c<d;c++){if(h&&c%200==0){var t=(new Date).getTime()-e;if(u<t)break}if((s=o[c])instanceof window.noConflictLeafletCore.LayerGroup)f&&(o=o.slice(),f=!1),this._extractNonGroupLayers(s,o),d=o.length;else if(s.getLatLng){if(!this.hasLayer(s)&&(this._addLayer(s,this._maxZoom),r||this.fire("layeradd",{layer:s}),s.__parent&&2===s.__parent.getChildCount())){var i=s.__parent.getAllChildMarkers(),n=i[0]===s?i[1]:i[0];a.removeLayer(n)}}else l.addLayer(s),r||this.fire("layeradd",{layer:s})}_&&_(c,d,(new Date).getTime()-p),c===d?(this._topClusterLevel._recalculateBounds(),this._refreshClustersIcons(),this._topClusterLevel._recursivelyAddChildrenToMap(null,this._zoom,this._currentShownBounds)):setTimeout(m,this.options.chunkDelay)},this);m()}else for(var e=this._needsClustering;c<d;c++)(s=o[c])instanceof window.noConflictLeafletCore.LayerGroup?(f&&(o=o.slice(),f=!1),this._extractNonGroupLayers(s,o),d=o.length):s.getLatLng?this.hasLayer(s)||e.push(s):l.addLayer(s);return this},removeLayers:function(e){var t,i,n=e.length,o=this._featureGroup,r=this._nonPointGroup,s=!0;if(!this._map){for(t=0;t<n;t++)(i=e[t])instanceof window.noConflictLeafletCore.LayerGroup?(s&&(e=e.slice(),s=!1),this._extractNonGroupLayers(i,e),n=e.length):(this._arraySplice(this._needsClustering,i),r.removeLayer(i),this.hasLayer(i)&&this._needsRemoving.push({layer:i,latlng:i._latlng}),this.fire("layerremove",{layer:i}));return this}if(this._unspiderfy){this._unspiderfy();var a=e.slice(),l=n;for(t=0;t<l;t++)(i=a[t])instanceof window.noConflictLeafletCoreLayerGroup?(this._extractNonGroupLayers(i,a),l=a.length):this._unspiderfyLayer(i)}for(t=0;t<n;t++)(i=e[t])instanceof window.noConflictLeafletCore.LayerGroup?(s&&(e=e.slice(),s=!1),this._extractNonGroupLayers(i,e),n=e.length):i.__parent?(this._removeLayer(i,!0,!0),this.fire("layerremove",{layer:i}),o.hasLayer(i)&&(o.removeLayer(i),i.clusterShow&&i.clusterShow())):(r.removeLayer(i),this.fire("layerremove",{layer:i}));return this._topClusterLevel._recalculateBounds(),this._refreshClustersIcons(),this._topClusterLevel._recursivelyAddChildrenToMap(null,this._zoom,this._currentShownBounds),this},clearLayers:function(){return this._map||(this._needsClustering=[],this._needsRemoving=[],delete this._gridClusters,delete this._gridUnclustered),this._noanimationUnspiderfy&&this._noanimationUnspiderfy(),this._featureGroup.clearLayers(),this._nonPointGroup.clearLayers(),this.eachLayer(function(e){e.off(this._childMarkerEventHandlers,this),delete e.__parent},this),this._map&&this._generateInitialClusters(),this},getBounds:function(){var e=new window.noConflictLeafletCore.LatLngBounds;this._topClusterLevel&&e.extend(this._topClusterLevel._bounds);for(var t=this._needsClustering.length-1;0<=t;t--)e.extend(this._needsClustering[t].getLatLng());return e.extend(this._nonPointGroup.getBounds()),e},eachLayer:function(e,t){var i,n,o,r=this._needsClustering.slice(),s=this._needsRemoving;for(this._topClusterLevel&&this._topClusterLevel.getAllChildMarkers(r),n=r.length-1;0<=n;n--){for(i=!0,o=s.length-1;0<=o;o--)if(s[o].layer===r[n]){i=!1;break}i&&e.call(t,r[n])}this._nonPointGroup.eachLayer(e,t)},getLayers:function(){var t=[];return this.eachLayer(function(e){t.push(e)}),t},getLayer:function(t){var i=null;return t=parseInt(t,10),this.eachLayer(function(e){window.noConflictLeafletCore.stamp(e)===t&&(i=e)}),i},hasLayer:function(e){if(!e)return!1;var t,i=this._needsClustering;for(t=i.length-1;0<=t;t--)if(i[t]===e)return!0;for(t=(i=this._needsRemoving).length-1;0<=t;t--)if(i[t].layer===e)return!1;return!(!e.__parent||e.__parent._group!==this)||this._nonPointGroup.hasLayer(e)},zoomToShowLayer:function(e,t){var i=this._map;"function"!=typeof t&&(t=function(){});var n=function(){!i.hasLayer(e)&&!i.hasLayer(e.__parent)||this._inZoomAnimation||(this._map.off("moveend",n,this),this.off("animationend",n,this),i.hasLayer(e)?t():e.__parent._icon&&(this.once("spiderfied",t,this),e.__parent.spiderfy()))};e._icon&&this._map.getBounds().contains(e.getLatLng())?t():e.__parent._zoom<Math.round(this._map._zoom)?(this._map.on("moveend",n,this),this._map.panTo(e.getLatLng())):(this._map.on("moveend",n,this),this.on("animationend",n,this),e.__parent.zoomToBounds())},onAdd:function(e){var t,i,n;if(this._map=e,!isFinite(this._map.getMaxZoom()))throw"Map has no maxZoom specified";for(this._featureGroup.addTo(e),this._nonPointGroup.addTo(e),this._gridClusters||this._generateInitialClusters(),this._maxLat=e.options.crs.projection.MAX_LATITUDE,t=0,i=this._needsRemoving.length;t<i;t++)(n=this._needsRemoving[t]).newlatlng=n.layer._latlng,n.layer._latlng=n.latlng;for(t=0,i=this._needsRemoving.length;t<i;t++)n=this._needsRemoving[t],this._removeLayer(n.layer,!0),n.layer._latlng=n.newlatlng;this._needsRemoving=[],this._zoom=Math.round(this._map._zoom),this._currentShownBounds=this._getExpandedVisibleBounds(),this._map.on("zoomend",this._zoomEnd,this),this._map.on("moveend",this._moveEnd,this),this._spiderfierOnAdd&&this._spiderfierOnAdd(),this._bindEvents(),i=this._needsClustering,this._needsClustering=[],this.addLayers(i,!0)},onRemove:function(e){e.off("zoomend",this._zoomEnd,this),e.off("moveend",this._moveEnd,this),this._unbindEvents(),this._map._mapPane.className=this._map._mapPane.className.replace(" leaflet-cluster-anim",""),this._spiderfierOnRemove&&this._spiderfierOnRemove(),delete this._maxLat,this._hideCoverage(),this._featureGroup.remove(),this._nonPointGroup.remove(),this._featureGroup.clearLayers(),this._map=null},getVisibleParent:function(e){for(var t=e;t&&!t._icon;)t=t.__parent;return t||null},_arraySplice:function(e,t){for(var i=e.length-1;0<=i;i--)if(e[i]===t)return e.splice(i,1),!0},_removeFromGridUnclustered:function(e,t){for(var i=this._map,n=this._gridUnclustered,o=Math.floor(this._map.getMinZoom());o<=t&&n[t].removeObject(e,i.project(e.getLatLng(),t));t--);},_childMarkerDragStart:function(e){e.target.__dragStart=e.target._latlng},_childMarkerMoved:function(e){if(!this._ignoreMove&&!e.target.__dragStart){var t=e.target._popup&&e.target._popup.isOpen();this._moveChild(e.target,e.oldLatLng,e.latlng),t&&e.target.openPopup()}},_moveChild:function(e,t,i){e._latlng=t,this.removeLayer(e),e._latlng=i,this.addLayer(e)},_childMarkerDragEnd:function(e){var t=e.target.__dragStart;delete e.target.__dragStart,t&&this._moveChild(e.target,t,e.target._latlng)},_removeLayer:function(e,t,i){var n=this._gridClusters,o=this._gridUnclustered,r=this._featureGroup,s=this._map,a=Math.floor(this._map.getMinZoom());t&&this._removeFromGridUnclustered(e,this._maxZoom);var l,h=e.__parent,u=h._markers;for(this._arraySplice(u,e);h&&(h._childCount--,h._boundsNeedUpdate=!0,!(h._zoom<a));)t&&h._childCount<=1?(l=h._markers[0]===e?h._markers[1]:h._markers[0],n[h._zoom].removeObject(h,s.project(h._cLatLng,h._zoom)),o[h._zoom].addObject(l,s.project(l.getLatLng(),h._zoom)),this._arraySplice(h.__parent._childClusters,h),h.__parent._markers.push(l),l.__parent=h.__parent,h._icon&&(r.removeLayer(h),i||r.addLayer(l))):h._iconNeedsUpdate=!0,h=h.__parent;delete e.__parent},_isOrIsParent:function(e,t){for(;t;){if(e===t)return!0;t=t.parentNode}return!1},fire:function(e,t,i){if(t&&t.layer instanceof window.noConflictLeafletCore.MarkerCluster){if(t.originalEvent&&this._isOrIsParent(t.layer._icon,t.originalEvent.relatedTarget))return;e="cluster"+e}window.noConflictLeafletCore.FeatureGroup.prototype.fire.call(this,e,t,i)},listens:function(e,t){return window.noConflictLeafletCore.FeatureGroup.prototype.listens.call(this,e,t)||window.noConflictLeafletCore.FeatureGroup.prototype.listens.call(this,"cluster"+e,t)},_defaultIconCreateFunction:function(e){var t=e.getChildCount(),i=" marker-cluster-";return i+=t<10?"small":t<100?"medium":"large",new window.noConflictLeafletCore.DivIcon({html:"<div><span>"+t+"</span></div>",className:"marker-cluster"+i,iconSize:new window.noConflictLeafletCore.Point(40,40)})},_bindEvents:function(){var e=this._map,t=this.options.spiderfyOnMaxZoom,i=this.options.showCoverageOnHover,n=this.options.zoomToBoundsOnClick;(t||n)&&this.on("clusterclick",this._zoomOrSpiderfy,this),i&&(this.on("clustermouseover",this._showCoverage,this),this.on("clustermouseout",this._hideCoverage,this),e.on("zoomend",this._hideCoverage,this))},_zoomOrSpiderfy:function(e){for(var t=e.layer,i=t;1===i._childClusters.length;)i=i._childClusters[0];i._zoom===this._maxZoom&&i._childCount===t._childCount&&this.options.spiderfyOnMaxZoom?t.spiderfy():this.options.zoomToBoundsOnClick&&t.zoomToBounds(),e.originalEvent&&13===e.originalEvent.keyCode&&this._map._container.focus()},_showCoverage:function(e){var t=this._map;this._inZoomAnimation||(this._shownPolygon&&t.removeLayer(this._shownPolygon),2<e.layer.getChildCount()&&e.layer!==this._spiderfied&&(this._shownPolygon=new window.noConflictLeafletCore.Polygon(e.layer.getConvexHull(),this.options.polygonOptions),t.addLayer(this._shownPolygon)))},_hideCoverage:function(){this._shownPolygon&&(this._map.removeLayer(this._shownPolygon),this._shownPolygon=null)},_unbindEvents:function(){var e=this.options.spiderfyOnMaxZoom,t=this.options.showCoverageOnHover,i=this.options.zoomToBoundsOnClick,n=this._map;(e||i)&&this.off("clusterclick",this._zoomOrSpiderfy,this),t&&(this.off("clustermouseover",this._showCoverage,this),this.off("clustermouseout",this._hideCoverage,this),n.off("zoomend",this._hideCoverage,this))},_zoomEnd:function(){this._map&&(this._mergeSplitClusters(),this._zoom=Math.round(this._map._zoom),this._currentShownBounds=this._getExpandedVisibleBounds())},_moveEnd:function(){if(!this._inZoomAnimation){var e=this._getExpandedVisibleBounds();this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,Math.floor(this._map.getMinZoom()),this._zoom,e),this._topClusterLevel._recursivelyAddChildrenToMap(null,Math.round(this._map._zoom),e),this._currentShownBounds=e}},_generateInitialClusters:function(){var e=Math.ceil(this._map.getMaxZoom()),t=Math.floor(this._map.getMinZoom()),i=this.options.maxClusterRadius,n=i;"function"!=typeof i&&(n=function(){return i}),null!==this.options.disableClusteringAtZoom&&(e=this.options.disableClusteringAtZoom-1),this._maxZoom=e,this._gridClusters={},this._gridUnclustered={};for(var o=e;t<=o;o--)this._gridClusters[o]=new window.noConflictLeafletCore.DistanceGrid(n(o)),this._gridUnclustered[o]=new window.noConflictLeafletCore.DistanceGrid(n(o));this._topClusterLevel=new this._markerCluster(this,t-1)},_addLayer:function(e,t){var i,n,o=this._gridClusters,r=this._gridUnclustered,s=Math.floor(this._map.getMinZoom());for(this.options.singleMarkerMode&&this._overrideMarkerIcon(e),e.on(this._childMarkerEventHandlers,this);s<=t;t--){i=this._map.project(e.getLatLng(),t);var a=o[t].getNearObject(i);if(a)return a._addChild(e),void(e.__parent=a);if(a=r[t].getNearObject(i)){var l=a.__parent;l&&this._removeLayer(a,!1);var h=new this._markerCluster(this,t,a,e);o[t].addObject(h,this._map.project(h._cLatLng,t)),a.__parent=h;var u=e.__parent=h;for(n=t-1;n>l._zoom;n--)u=new this._markerCluster(this,n,u),o[n].addObject(u,this._map.project(a.getLatLng(),n));return l._addChild(u),void this._removeFromGridUnclustered(a,t)}r[t].addObject(e,i)}this._topClusterLevel._addChild(e),e.__parent=this._topClusterLevel},_refreshClustersIcons:function(){this._featureGroup.eachLayer(function(e){e instanceof window.noConflictLeafletCore.MarkerCluster&&e._iconNeedsUpdate&&e._updateIcon()})},_enqueue:function(e){this._queue.push(e),this._queueTimeout||(this._queueTimeout=setTimeout(window.noConflictLeafletCore.bind(this._processQueue,this),300))},_processQueue:function(){for(var e=0;e<this._queue.length;e++)this._queue[e].call(this);this._queue.length=0,clearTimeout(this._queueTimeout),this._queueTimeout=null},_mergeSplitClusters:function(){var e=Math.round(this._map._zoom);this._processQueue(),this._zoom<e&&this._currentShownBounds.intersects(this._getExpandedVisibleBounds())?(this._animationStart(),this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,Math.floor(this._map.getMinZoom()),this._zoom,this._getExpandedVisibleBounds()),this._animationZoomIn(this._zoom,e)):this._zoom>e?(this._animationStart(),this._animationZoomOut(this._zoom,e)):this._moveEnd()},_getExpandedVisibleBounds:function(){return this.options.removeOutsideVisibleBounds?window.noConflictLeafletCore.Browser.mobile?this._checkBoundsMaxLat(this._map.getBounds()):this._checkBoundsMaxLat(this._map.getBounds().pad(1)):this._mapBoundsInfinite},_checkBoundsMaxLat:function(e){var t=this._maxLat;return void 0!==t&&(e.getNorth()>=t&&(e._northEast.lat=1/0),e.getSouth()<=-t&&(e._southWest.lat=-1/0)),e},_animationAddLayerNonAnimated:function(e,t){if(t===e)this._featureGroup.addLayer(e);else if(2===t._childCount){t._addToMap();var i=t.getAllChildMarkers();this._featureGroup.removeLayer(i[0]),this._featureGroup.removeLayer(i[1])}else t._updateIcon()},_extractNonGroupLayers:function(e,t){var i,n=e.getLayers(),o=0;for(t=t||[];o<n.length;o++)(i=n[o])instanceof window.noConflictLeafletCore.LayerGroup?this._extractNonGroupLayers(i,t):t.push(i);return t},_overrideMarkerIcon:function(e){return e.options.icon=this.options.iconCreateFunction({getChildCount:function(){return 1},getAllChildMarkers:function(){return[e]}})}});window.noConflictLeafletCore.MarkerClusterGroup.include({_mapBoundsInfinite:new window.noConflictLeafletCore.LatLngBounds(new window.noConflictLeafletCore.LatLng(-1/0,-1/0),new window.noConflictLeafletCore.LatLng(1/0,1/0))}),window.noConflictLeafletCore.MarkerClusterGroup.include({_noAnimation:{_animationStart:function(){},_animationZoomIn:function(e,t){this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,Math.floor(this._map.getMinZoom()),e),this._topClusterLevel._recursivelyAddChildrenToMap(null,t,this._getExpandedVisibleBounds()),this.fire("animationend")},_animationZoomOut:function(e,t){this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,Math.floor(this._map.getMinZoom()),e),this._topClusterLevel._recursivelyAddChildrenToMap(null,t,this._getExpandedVisibleBounds()),this.fire("animationend")},_animationAddLayer:function(e,t){this._animationAddLayerNonAnimated(e,t)}},_withAnimation:{_animationStart:function(){this._map._mapPane.className+=" leaflet-cluster-anim",this._inZoomAnimation++},_animationZoomIn:function(o,r){var s,a=this._getExpandedVisibleBounds(),l=this._featureGroup,e=Math.floor(this._map.getMinZoom());this._ignoreMove=!0,this._topClusterLevel._recursively(a,o,e,function(e){var t,i=e._latlng,n=e._markers;for(a.contains(i)||(i=null),e._isSingleParent()&&o+1===r?(l.removeLayer(e),e._recursivelyAddChildrenToMap(null,r,a)):(e.clusterHide(),e._recursivelyAddChildrenToMap(i,r,a)),s=n.length-1;0<=s;s--)t=n[s],a.contains(t._latlng)||l.removeLayer(t)}),this._forceLayout(),this._topClusterLevel._recursivelyBecomeVisible(a,r),l.eachLayer(function(e){e instanceof window.noConflictLeafletCore.MarkerCluster||!e._icon||e.clusterShow()}),this._topClusterLevel._recursively(a,o,r,function(e){e._recursivelyRestoreChildPositions(r)}),this._ignoreMove=!1,this._enqueue(function(){this._topClusterLevel._recursively(a,o,e,function(e){l.removeLayer(e),e.clusterShow()}),this._animationEnd()})},_animationZoomOut:function(e,t){this._animationZoomOutSingle(this._topClusterLevel,e-1,t),this._topClusterLevel._recursivelyAddChildrenToMap(null,t,this._getExpandedVisibleBounds()),this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,Math.floor(this._map.getMinZoom()),e,this._getExpandedVisibleBounds())},_animationAddLayer:function(e,t){var i=this,n=this._featureGroup;n.addLayer(e),t!==e&&(2<t._childCount?(t._updateIcon(),this._forceLayout(),this._animationStart(),e._setPos(this._map.latLngToLayerPoint(t.getLatLng())),e.clusterHide(),this._enqueue(function(){n.removeLayer(e),e.clusterShow(),i._animationEnd()})):(this._forceLayout(),i._animationStart(),i._animationZoomOutSingle(t,this._map.getMaxZoom(),this._zoom)))}},_animationZoomOutSingle:function(t,i,n){var o=this._getExpandedVisibleBounds(),r=Math.floor(this._map.getMinZoom());t._recursivelyAnimateChildrenInAndAddSelfToMap(o,r,i+1,n);var s=this;this._forceLayout(),t._recursivelyBecomeVisible(o,n),this._enqueue(function(){if(1===t._childCount){var e=t._markers[0];this._ignoreMove=!0,e.setLatLng(e.getLatLng()),this._ignoreMove=!1,e.clusterShow&&e.clusterShow()}else t._recursively(o,n,r,function(e){e._recursivelyRemoveChildrenFromMap(o,r,i+1)});s._animationEnd()})},_animationEnd:function(){this._map&&(this._map._mapPane.className=this._map._mapPane.className.replace(" leaflet-cluster-anim","")),this._inZoomAnimation--,this.fire("animationend")},_forceLayout:function(){window.noConflictLeafletCore.Util.falseFn(document.body.offsetWidth)}}),window.noConflictLeafletCore.markerClusterGroup=function(e){return new window.noConflictLeafletCore.MarkerClusterGroup(e)};var i=window.noConflictLeafletCore.MarkerCluster=window.noConflictLeafletCore.Marker.extend({options:window.noConflictLeafletCore.Icon.prototype.options,initialize:function(e,t,i,n){window.noConflictLeafletCore.Marker.prototype.initialize.call(this,i?i._cLatLng||i.getLatLng():new window.noConflictLeafletCore.LatLng(0,0),{icon:this,pane:e.options.clusterPane}),this._group=e,this._zoom=t,this._markers=[],this._childClusters=[],this._childCount=0,this._iconNeedsUpdate=!0,this._boundsNeedUpdate=!0,this._bounds=new window.noConflictLeafletCore.LatLngBounds,i&&this._addChild(i),n&&this._addChild(n)},getAllChildMarkers:function(e,t){e=e||[];for(var i=this._childClusters.length-1;0<=i;i--)this._childClusters[i].getAllChildMarkers(e);for(var n=this._markers.length-1;0<=n;n--)t&&this._markers[n].__dragStart||e.push(this._markers[n]);return e},getChildCount:function(){return this._childCount},zoomToBounds:function(e){for(var t,i=this._childClusters.slice(),n=this._group._map,o=n.getBoundsZoom(this._bounds),r=this._zoom+1,s=n.getZoom();0<i.length&&r<o;){r++;var a=[];for(t=0;t<i.length;t++)a=a.concat(i[t]._childClusters);i=a}r<o?this._group._map.setView(this._latlng,r):o<=s?this._group._map.setView(this._latlng,s+1):this._group._map.fitBounds(this._bounds,e)},getBounds:function(){var e=new window.noConflictLeafletCore.LatLngBounds;return e.extend(this._bounds),e},_updateIcon:function(){this._iconNeedsUpdate=!0,this._icon&&this.setIcon(this)},createIcon:function(){return this._iconNeedsUpdate&&(this._iconObj=this._group.options.iconCreateFunction(this),this._iconNeedsUpdate=!1),this._iconObj.createIcon()},createShadow:function(){return this._iconObj.createShadow()},_addChild:function(e,t){this._iconNeedsUpdate=!0,this._boundsNeedUpdate=!0,this._setClusterCenter(e),e instanceof window.noConflictLeafletCore.MarkerCluster?(t||(this._childClusters.push(e),e.__parent=this),this._childCount+=e._childCount):(t||this._markers.push(e),this._childCount++),this.__parent&&this.__parent._addChild(e,!0)},_setClusterCenter:function(e){this._cLatLng||(this._cLatLng=e._cLatLng||e._latlng)},_resetBounds:function(){var e=this._bounds;e._southWest&&(e._southWest.lat=1/0,e._southWest.lng=1/0),e._northEast&&(e._northEast.lat=-1/0,e._northEast.lng=-1/0)},_recalculateBounds:function(){var e,t,i,n,o=this._markers,r=this._childClusters,s=0,a=0,l=this._childCount;if(0!==l){for(this._resetBounds(),e=0;e<o.length;e++)i=o[e]._latlng,this._bounds.extend(i),s+=i.lat,a+=i.lng;for(e=0;e<r.length;e++)(t=r[e])._boundsNeedUpdate&&t._recalculateBounds(),this._bounds.extend(t._bounds),i=t._wLatLng,n=t._childCount,s+=i.lat*n,a+=i.lng*n;this._latlng=this._wLatLng=new window.noConflictLeafletCore.LatLng(s/l,a/l),this._boundsNeedUpdate=!1}},_addToMap:function(e){e&&(this._backupLatlng=this._latlng,this.setLatLng(e)),this._group._featureGroup.addLayer(this)},_recursivelyAnimateChildrenIn:function(e,o,t){this._recursively(e,this._group._map.getMinZoom(),t-1,function(e){var t,i,n=e._markers;for(t=n.length-1;0<=t;t--)(i=n[t])._icon&&(i._setPos(o),i.clusterHide())},function(e){var t,i,n=e._childClusters;for(t=n.length-1;0<=t;t--)(i=n[t])._icon&&(i._setPos(o),i.clusterHide())})},_recursivelyAnimateChildrenInAndAddSelfToMap:function(t,i,n,o){this._recursively(t,o,i,function(e){e._recursivelyAnimateChildrenIn(t,e._group._map.latLngToLayerPoint(e.getLatLng()).round(),n),e._isSingleParent()&&n-1===o?(e.clusterShow(),e._recursivelyRemoveChildrenFromMap(t,i,n)):e.clusterHide(),e._addToMap()})},_recursivelyBecomeVisible:function(e,t){this._recursively(e,this._group._map.getMinZoom(),t,null,function(e){e.clusterShow()})},_recursivelyAddChildrenToMap:function(n,o,r){this._recursively(r,this._group._map.getMinZoom()-1,o,function(e){if(o!==e._zoom)for(var t=e._markers.length-1;0<=t;t--){var i=e._markers[t];r.contains(i._latlng)&&(n&&(i._backupLatlng=i.getLatLng(),i.setLatLng(n),i.clusterHide&&i.clusterHide()),e._group._featureGroup.addLayer(i))}},function(e){e._addToMap(n)})},_recursivelyRestoreChildPositions:function(e){for(var t=this._markers.length-1;0<=t;t--){var i=this._markers[t];i._backupLatlng&&(i.setLatLng(i._backupLatlng),delete i._backupLatlng)}if(e-1===this._zoom)for(var n=this._childClusters.length-1;0<=n;n--)this._childClusters[n]._restorePosition();else for(var o=this._childClusters.length-1;0<=o;o--)this._childClusters[o]._recursivelyRestoreChildPositions(e)},_restorePosition:function(){this._backupLatlng&&(this.setLatLng(this._backupLatlng),delete this._backupLatlng)},_recursivelyRemoveChildrenFromMap:function(e,t,i,n){var o,r;this._recursively(e,t-1,i-1,function(e){for(r=e._markers.length-1;0<=r;r--)o=e._markers[r],n&&n.contains(o._latlng)||(e._group._featureGroup.removeLayer(o),o.clusterShow&&o.clusterShow())},function(e){for(r=e._childClusters.length-1;0<=r;r--)o=e._childClusters[r],n&&n.contains(o._latlng)||(e._group._featureGroup.removeLayer(o),o.clusterShow&&o.clusterShow())})},_recursively:function(e,t,i,n,o){var r,s,a=this._childClusters,l=this._zoom;if(t<=l&&(n&&n(this),o&&l===i&&o(this)),l<t||l<i)for(r=a.length-1;0<=r;r--)(s=a[r])._boundsNeedUpdate&&s._recalculateBounds(),e.intersects(s._bounds)&&s._recursively(e,t,i,n,o)},_isSingleParent:function(){return 0<this._childClusters.length&&this._childClusters[0]._childCount===this._childCount}});window.noConflictLeafletCore.Marker.include({clusterHide:function(){var e=this.options.opacity;return this.setOpacity(0),this.options.opacity=e,this},clusterShow:function(){return this.setOpacity(this.options.opacity)}}),window.noConflictLeafletCore.DistanceGrid=function(e){this._cellSize=e,this._sqCellSize=e*e,this._grid={},this._objectPoint={}},window.noConflictLeafletCore.DistanceGrid.prototype={addObject:function(e,t){var i=this._getCoord(t.x),n=this._getCoord(t.y),o=this._grid,r=o[n]=o[n]||{},s=r[i]=r[i]||[],a=window.noConflictLeafletCore.Util.stamp(e);this._objectPoint[a]=t,s.push(e)},updateObject:function(e,t){this.removeObject(e),this.addObject(e,t)},removeObject:function(e,t){var i,n,o=this._getCoord(t.x),r=this._getCoord(t.y),s=this._grid,a=s[r]=s[r]||{},l=a[o]=a[o]||[];for(delete this._objectPoint[window.noConflictLeafletCore.Util.stamp(e)],i=0,n=l.length;i<n;i++)if(l[i]===e)return l.splice(i,1),1===n&&delete a[o],!0},eachObject:function(e,t){var i,n,o,r,s,a,l=this._grid;for(i in l)for(n in s=l[i])for(o=0,r=(a=s[n]).length;o<r;o++)e.call(t,a[o])&&(o--,r--)},getNearObject:function(e){var t,i,n,o,r,s,a,l,h=this._getCoord(e.x),u=this._getCoord(e.y),_=this._objectPoint,d=this._sqCellSize,c=null;for(t=u-1;t<=u+1;t++)if(o=this._grid[t])for(i=h-1;i<=h+1;i++)if(r=o[i])for(n=0,s=r.length;n<s;n++)a=r[n],((l=this._sqDist(_[window.noConflictLeafletCore.Util.stamp(a)],e))<d||l<=d&&null===c)&&(d=l,c=a);return c},_getCoord:function(e){var t=Math.floor(e/this._cellSize);return isFinite(t)?t:e},_sqDist:function(e,t){var i=t.x-e.x,n=t.y-e.y;return i*i+n*n}},window.noConflictLeafletCore.QuickHull={getDistant:function(e,t){var i=t[1].lat-t[0].lat;return(t[0].lng-t[1].lng)*(e.lat-t[0].lat)+i*(e.lng-t[0].lng)},findMostDistantPointFromBaseLine:function(e,t){var i,n,o,r=0,s=null,a=[];for(i=t.length-1;0<=i;i--)n=t[i],0<(o=this.getDistant(n,e))&&(a.push(n),r<o&&(r=o,s=n));return{maxPoint:s,newPoints:a}},buildConvexHull:function(e,t){var i=[],n=this.findMostDistantPointFromBaseLine(e,t);return n.maxPoint?i=(i=i.concat(this.buildConvexHull([e[0],n.maxPoint],n.newPoints))).concat(this.buildConvexHull([n.maxPoint,e[1]],n.newPoints)):[e[0]]},getConvexHull:function(e){var t,i=!1,n=!1,o=!1,r=!1,s=null,a=null,l=null,h=null,u=null,_=null;for(t=e.length-1;0<=t;t--){var d=e[t];(!1===i||d.lat>i)&&(i=(s=d).lat),(!1===n||d.lat<n)&&(n=(a=d).lat),(!1===o||d.lng>o)&&(o=(l=d).lng),(!1===r||d.lng<r)&&(r=(h=d).lng)}return u=n!==i?(_=a,s):(_=h,l),[].concat(this.buildConvexHull([_,u],e),this.buildConvexHull([u,_],e))}},window.noConflictLeafletCore.MarkerCluster.include({getConvexHull:function(){var e,t,i=this.getAllChildMarkers(),n=[];for(t=i.length-1;0<=t;t--)e=i[t].getLatLng(),n.push(e);return window.noConflictLeafletCore.QuickHull.getConvexHull(n)}}),window.noConflictLeafletCore.MarkerCluster.include({_2PI:2*Math.PI,_circleFootSeparation:25,_circleStartAngle:0,_spiralFootSeparation:28,_spiralLengthStart:11,_spiralLengthFactor:5,_circleSpiralSwitchover:9,spiderfy:function(){if(this._group._spiderfied!==this&&!this._group._inZoomAnimation){var e,t=this.getAllChildMarkers(null,!0),i=this._group._map.latLngToLayerPoint(this._latlng);this._group._unspiderfy(),e=(this._group._spiderfied=this)._group.options.spiderfyShapePositions?this._group.options.spiderfyShapePositions(t.length,i):t.length>=this._circleSpiralSwitchover?this._generatePointsSpiral(t.length,i):(i.y+=10,this._generatePointsCircle(t.length,i)),this._animationSpiderfy(t,e)}},unspiderfy:function(e){this._group._inZoomAnimation||(this._animationUnspiderfy(e),this._group._spiderfied=null)},_generatePointsCircle:function(e,t){var i,n,o=this._group.options.spiderfyDistanceMultiplier*this._circleFootSeparation*(2+e)/this._2PI,r=this._2PI/e,s=[];for(o=Math.max(o,35),s.length=e,i=0;i<e;i++)n=this._circleStartAngle+i*r,s[i]=new window.noConflictLeafletCore.Point(t.x+o*Math.cos(n),t.y+o*Math.sin(n))._round();return s},_generatePointsSpiral:function(e,t){var i,n=this._group.options.spiderfyDistanceMultiplier,o=n*this._spiralLengthStart,r=n*this._spiralFootSeparation,s=n*this._spiralLengthFactor*this._2PI,a=0,l=[];for(i=l.length=e;0<=i;i--)i<e&&(l[i]=new window.noConflictLeafletCore.Point(t.x+o*Math.cos(a),t.y+o*Math.sin(a))._round()),o+=s/(a+=r/o+5e-4*i);return l},_noanimationUnspiderfy:function(){var e,t,i=this._group,n=i._map,o=i._featureGroup,r=this.getAllChildMarkers(null,!0);for(i._ignoreMove=!0,this.setOpacity(1),t=r.length-1;0<=t;t--)e=r[t],o.removeLayer(e),e._preSpiderfyLatlng&&(e.setLatLng(e._preSpiderfyLatlng),delete e._preSpiderfyLatlng),e.setZIndexOffset&&e.setZIndexOffset(0),e._spiderLeg&&(n.removeLayer(e._spiderLeg),delete e._spiderLeg);i.fire("unspiderfied",{cluster:this,markers:r}),i._ignoreMove=!1,i._spiderfied=null}}),window.noConflictLeafletCore.MarkerClusterNonAnimated=window.noConflictLeafletCore.MarkerCluster.extend({_animationSpiderfy:function(e,t){var i,n,o,r,s=this._group,a=s._map,l=s._featureGroup,h=this._group.options.spiderLegPolylineOptions;for(s._ignoreMove=!0,i=0;i<e.length;i++)r=a.layerPointToLatLng(t[i]),n=e[i],o=new window.noConflictLeafletCore.Polyline([this._latlng,r],h),a.addLayer(o),n._spiderLeg=o,n._preSpiderfyLatlng=n._latlng,n.setLatLng(r),n.setZIndexOffset&&n.setZIndexOffset(1e6),l.addLayer(n);this.setOpacity(.3),s._ignoreMove=!1,s.fire("spiderfied",{cluster:this,markers:e})},_animationUnspiderfy:function(){this._noanimationUnspiderfy()}}),window.noConflictLeafletCore.MarkerCluster.include({_animationSpiderfy:function(e,t){var i,n,o,r,s,a,l=this,h=this._group,u=h._map,_=h._featureGroup,d=this._latlng,c=u.latLngToLayerPoint(d),f=window.noConflictLeafletCore.Path.SVG,p=window.noConflictLeafletCore.extend({},this._group.options.spiderLegPolylineOptions),m=p.opacity;for(void 0===m&&(m=window.noConflictLeafletCore.MarkerClusterGroup.prototype.options.spiderLegPolylineOptions.opacity),f?(p.opacity=0,p.className=(p.className||"")+" leaflet-cluster-spider-leg"):p.opacity=m,h._ignoreMove=!0,i=0;i<e.length;i++)n=e[i],a=u.layerPointToLatLng(t[i]),o=new window.noConflictLeafletCore.Polyline([d,a],p),u.addLayer(o),n._spiderLeg=o,f&&(s=(r=o._path).getTotalLength()+.1,r.style.strokeDasharray=s,r.style.strokeDashoffset=s),n.setZIndexOffset&&n.setZIndexOffset(1e6),n.clusterHide&&n.clusterHide(),_.addLayer(n),n._setPos&&n._setPos(c);for(h._forceLayout(),h._animationStart(),i=e.length-1;0<=i;i--)a=u.layerPointToLatLng(t[i]),(n=e[i])._preSpiderfyLatlng=n._latlng,n.setLatLng(a),n.clusterShow&&n.clusterShow(),f&&((r=(o=n._spiderLeg)._path).style.strokeDashoffset=0,o.setStyle({opacity:m}));this.setOpacity(.3),h._ignoreMove=!1,setTimeout(function(){h._animationEnd(),h.fire("spiderfied",{cluster:l,markers:e})},200)},_animationUnspiderfy:function(e){var t,i,n,o,r,s,a=this,l=this._group,h=l._map,u=l._featureGroup,_=e?h._latLngToNewLayerPoint(this._latlng,e.zoom,e.center):h.latLngToLayerPoint(this._latlng),d=this.getAllChildMarkers(null,!0),c=window.noConflictLeafletCore.Path.SVG;for(l._ignoreMove=!0,l._animationStart(),this.setOpacity(1),i=d.length-1;0<=i;i--)(t=d[i])._preSpiderfyLatlng&&(t.closePopup(),t.setLatLng(t._preSpiderfyLatlng),delete t._preSpiderfyLatlng,s=!0,t._setPos&&(t._setPos(_),s=!1),t.clusterHide&&(t.clusterHide(),s=!1),s&&u.removeLayer(t),c&&(r=(o=(n=t._spiderLeg)._path).getTotalLength()+.1,o.style.strokeDashoffset=r,n.setStyle({opacity:0})));l._ignoreMove=!1,setTimeout(function(){var e=0;for(i=d.length-1;0<=i;i--)(t=d[i])._spiderLeg&&e++;for(i=d.length-1;0<=i;i--)(t=d[i])._spiderLeg&&(t.clusterShow&&t.clusterShow(),t.setZIndexOffset&&t.setZIndexOffset(0),1<e&&u.removeLayer(t),h.removeLayer(t._spiderLeg),delete t._spiderLeg);l._animationEnd(),l.fire("unspiderfied",{cluster:a,markers:d})},200)}}),window.noConflictLeafletCore.MarkerClusterGroup.include({_spiderfied:null,unspiderfy:function(){this._unspiderfy.apply(this,arguments)},_spiderfierOnAdd:function(){this._map.on("click",this._unspiderfyWrapper,this),this._map.options.zoomAnimation&&this._map.on("zoomstart",this._unspiderfyZoomStart,this),this._map.on("zoomend",this._noanimationUnspiderfy,this),window.noConflictLeafletCore.Browser.touch||this._map.getRenderer(this)},_spiderfierOnRemove:function(){this._map.off("click",this._unspiderfyWrapper,this),this._map.off("zoomstart",this._unspiderfyZoomStart,this),this._map.off("zoomanim",this._unspiderfyZoomAnim,this),this._map.off("zoomend",this._noanimationUnspiderfy,this),this._noanimationUnspiderfy()},_unspiderfyZoomStart:function(){this._map&&this._map.on("zoomanim",this._unspiderfyZoomAnim,this)},_unspiderfyZoomAnim:function(e){window.noConflictLeafletCore.DomUtil.hasClass(this._map._mapPane,"leaflet-touching")||(this._map.off("zoomanim",this._unspiderfyZoomAnim,this),this._unspiderfy(e))},_unspiderfyWrapper:function(){this._unspiderfy()},_unspiderfy:function(e){this._spiderfied&&this._spiderfied.unspiderfy(e)},_noanimationUnspiderfy:function(){this._spiderfied&&this._spiderfied._noanimationUnspiderfy()},_unspiderfyLayer:function(e){e._spiderLeg&&(this._featureGroup.removeLayer(e),e.clusterShow&&e.clusterShow(),e.setZIndexOffset&&e.setZIndexOffset(0),this._map.removeLayer(e._spiderLeg),delete e._spiderLeg)}}),window.noConflictLeafletCore.MarkerClusterGroup.include({refreshClusters:function(e){return e?e instanceof window.noConflictLeafletCore.MarkerClusterGroup?e=e._topClusterLevel.getAllChildMarkers():e instanceof window.noConflictLeafletCore.LayerGroup?e=e._layers:e instanceof window.noConflictLeafletCore.MarkerCluster?e=e.getAllChildMarkers():e instanceof window.noConflictLeafletCore.Marker&&(e=[e]):e=this._topClusterLevel.getAllChildMarkers(),this._flagParentsIconsNeedUpdate(e),this._refreshClustersIcons(),this.options.singleMarkerMode&&this._refreshSingleMarkerModeMarkers(e),this},_flagParentsIconsNeedUpdate:function(e){var t,i;for(t in e)for(i=e[t].__parent;i;)i._iconNeedsUpdate=!0,i=i.__parent},_refreshSingleMarkerModeMarkers:function(e){var t,i;for(t in e)i=e[t],this.hasLayer(i)&&i.setIcon(this._overrideMarkerIcon(i))}}),window.noConflictLeafletCore.Marker.include({refreshIconOptions:function(e,t){var i=this.options.icon;return window.noConflictLeafletCore.setOptions(i,e),this.setIcon(i),t&&this.__parent&&this.__parent._group.refreshClusters(this),this}}),e.SetLeafletCore=function(e){window.noConflictLeafletCore=e},e.MarkerClusterGroup=t,e.MarkerCluster=i,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=leaflet.markercluster.js.map