function _defineProperties(e,t){for(var a=0;a<t.length;a++){var i=t[a];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function _createClass(e,t,a){return t&&_defineProperties(e.prototype,t),a&&_defineProperties(e,a),e}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{RazQ:function(e,t,a){"use strict";a.r(t);var i,n=a("ofXK"),o=a("tyNb"),c=a("bSwM"),s=a("QibW"),r=a("qFsG"),l=a("lDzL"),u=a("NFeN"),p=a("bTqV"),d=a("Wp6s"),f=a("f0Cb"),h=a("wZkO"),b=a("MutI"),m=a("YUcS"),k=a("aYsj"),g=a("kmnG"),v=a("d3UM"),y=a("3Pt+"),w=a("1jcm"),C=a("Qu3c"),S=a("PCNd"),_=a("gU78"),x=a("3sEA"),P=a("AASI"),I=a("0IaG"),B=function e(t,a,i){_classCallCheck(this,e),this._id=t,this.name=a,this.company=i},D=a("fXoL"),M=a("dNgK"),N=a("XiUz"),V=((i=function(){function e(t,a,i){_classCallCheck(this,e),this.data=t,this.dialogRef=a,this.snackBar=i,this.deposit=new B("","","")}return _createClass(e,[{key:"ngOnInit",value:function(){this.build(this.data.payload)}},{key:"build",value:function(e){e&&(this.deposit=e)}},{key:"openSnackBar",value:function(e,t){this.snackBar.open(e,t,{duration:1e4})}},{key:"submit",value:function(){if(!this.check())return this.openSnackBar("Faltan campos para completar","Cerrar");this.dialogRef.close({deposit:this.deposit})}},{key:"check",value:function(){return""!=this.deposit.name}}]),e}()).\u0275fac=function(e){return new(e||i)(D.Vb(I.a),D.Vb(I.g),D.Vb(M.a))},i.\u0275cmp=D.Pb({type:i,selectors:[["app-deposit-popop"]],decls:11,vars:2,consts:[["matDialogTitle",""],[1,"p-0"],["fxLayout","row wrap","fxLayout.lt-sm","column"],["fxFlex","100",1,"pr-1"],[1,"full-width"],["type","text","placeholder","Nombre","aria-label","Text","matInput","","name","name",3,"ngModel","ngModelChange"],["mat-raised-button","","color","primary",3,"click"]],template:function(e,t){1&e&&(D.bc(0,"h1",0),D.Vc(1),D.ac(),D.bc(2,"mat-card",1),D.bc(3,"mat-card-content"),D.bc(4,"form"),D.bc(5,"div",2),D.bc(6,"div",3),D.bc(7,"mat-form-field",4),D.bc(8,"input",5),D.jc("ngModelChange",(function(e){return t.deposit.name=e})),D.ac(),D.ac(),D.ac(),D.ac(),D.bc(9,"button",6),D.jc("click",(function(e){return t.submit()})),D.Vc(10,"Guardar"),D.ac(),D.ac(),D.ac(),D.ac()),2&e&&(D.Gb(1),D.Wc(t.data.title),D.Gb(7),D.uc("ngModel",t.deposit.name))},directives:[d.a,d.c,y.x,y.o,y.p,N.d,N.b,g.a,r.b,y.c,y.n,y.q,p.b],encapsulation:2}),i);function j(e,t){if(1&e){var a=D.cc();D.bc(0,"div",5),D.bc(1,"button",6),D.jc("click",(function(e){return D.Mc(a),D.nc().toNew()})),D.Vc(2,"Nuevo"),D.ac(),D.ac()}}var L,G=[{path:"",children:[{path:"list",component:(L=function(){function e(t,a,i,n,o){_classCallCheck(this,e),this._userService=t,this._depositService=a,this.loader=i,this.snackBar=n,this.dialog=o,this.rows=[],this.columns=[],this.temp=[],this.canCreate=!1,this.token=t.getToken(),this.identity=t.getIdentity()}return _createClass(e,[{key:"ngOnInit",value:function(){this.getColumns(),this.getDeposits(),"ROLE_ADMIN"==this.identity.role&&(this.canCreate=!0)}},{key:"getDeposits",value:function(){var e=this;this._depositService.getList(this.token,{company:this.identity.company._id}).subscribe((function(t){t.deposits&&(e.rows=t.deposits,e.temp=t.deposits)}),(function(t){e.openSnackBar(t.message,"Cerrar")}))}},{key:"openSnackBar",value:function(e,t){this.snackBar.open(e,t,{duration:1e4})}},{key:"getColumns",value:function(){this.columns=[{prop:"name",name:"Nombre",flexGrow:1}]}},{key:"updateFilter",value:function(e){var t=e.target.value.toLowerCase(),a=Object.keys(this.temp[0]);if(a.splice(a.length-1),a.length){var i=this.temp.filter((function(e){for(var i=0;i<=a.length;i++){var n=a[i];if(e[n]&&e[n].toString().toLowerCase().indexOf(t)>-1)return!0}}));this.rows=i}}},{key:"toNew",value:function(){this.openPopUp(!0)}},{key:"openPopUp",value:function(e,t){var a=this;this.dialog.open(V,{width:"720px",disableClose:!1,data:{payload:t,title:e?"Nuevo deposito":"Editar deposito"}}).afterClosed().subscribe((function(t){if(t){if(a.loader.open(),e){var i=new B("",t.deposit.name,a.identity.company._id);a._depositService.add(a.token,i).subscribe((function(e){e.deposit&&(a.openSnackBar("Deposito creado","Cerrar"),a.getDeposits())}),(function(e){a.openSnackBar(e.message,"Cerrar")}))}else a._depositService.edit(a.token,t.deposit._id,t.deposit).subscribe((function(e){e.deposit&&(a.openSnackBar("Deposito actualizado","Cerrar"),a.getDeposits())}),(function(e){a.openSnackBar(e.message,"Cerrar")}));a.loader.close()}}))}},{key:"toProfile",value:function(e,t){"click"==e.type&&this.canCreate&&this.openPopUp(!1,e.row)}}]),e}(),L.\u0275fac=function(e){return new(e||L)(D.Vb(_.a),D.Vb(P.a),D.Vb(x.a),D.Vb(M.a),D.Vb(I.b))},L.\u0275cmp=D.Pb({type:L,selectors:[["app-deposit-list"]],features:[D.Fb([_.a,P.a])],decls:5,vars:8,consts:[[1,"margin-333",2,"width","100%"],["matInput","","placeholder","Filtrar por todas las columnas","value","",3,"keyup"],["class","profile-actions mb-1","style","margin-left: 5px;",4,"ngIf"],[1,"mat-box-shadow","margin-333"],[1,"material","bg-white",3,"columnMode","headerHeight","footerHeight","rowHeight","limit","rows","columns","activate"],[1,"profile-actions","mb-1",2,"margin-left","5px"],["mat-raised-button","","color","primary",3,"click"]],template:function(e,t){1&e&&(D.bc(0,"mat-form-field",0),D.bc(1,"input",1),D.jc("keyup",(function(e){return t.updateFilter(e)})),D.ac(),D.ac(),D.Tc(2,j,3,0,"div",2),D.bc(3,"div",3),D.bc(4,"ngx-datatable",4),D.jc("activate",(function(e){return t.toProfile(e)})),D.ac(),D.ac()),2&e&&(D.Gb(2),D.uc("ngIf",t.canCreate),D.Gb(2),D.uc("columnMode","flex")("headerHeight",40)("footerHeight",50)("rowHeight",50)("limit",7)("rows",t.rows)("columns",t.columns))},directives:[g.a,r.b,n.m,l.d,p.b],encapsulation:2}),L),data:{title:"Lista de depositos",breadcrumb:"LISTA DE DEPOSITOS"}}]}];a.d(t,"AppDepositModule",(function(){return T}));var O,T=((O=function e(){_classCallCheck(this,e)}).\u0275mod=D.Tb({type:O}),O.\u0275inj=D.Sb({factory:function(e){return new(e||O)},imports:[[n.c,y.t,g.c,y.j,f.b,v.b,S.a,b.d,C.b,u.b,p.c,d.e,w.a,c.b,s.c,h.c,r.c,m.a,l.e,k.a,o.k.forChild(G)]]}),O)}}]);