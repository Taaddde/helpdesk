function _defineProperties(e,t){for(var c=0;c<t.length;c++){var a=t[c];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function _createClass(e,t,c){return t&&_defineProperties(e.prototype,t),c&&_defineProperties(e,c),e}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{Ty4v:function(e,t,c){"use strict";c.r(t);var a,n=c("ofXK"),i=c("tyNb"),o=c("bSwM"),r=c("qFsG"),s=c("M9IT"),u=c("Dh3D"),l=c("+0xr"),b=c("lDzL"),d=c("NFeN"),p=c("bTqV"),m=c("Wp6s"),h=c("f0Cb"),f=c("wZkO"),g=c("7EHt"),y=c("MutI"),k=c("YUcS"),v=c("aYsj"),C=c("kmnG"),T=c("d3UM"),S=c("3Pt+"),M=c("1jcm"),_=c("Qu3c"),V=c("PCNd"),x=c("gU78"),G=c("O4PR"),w=c("0IaG"),I=c("1yaQ"),j=c("FKr1"),B=function e(t,c,a,n){_classCallCheck(this,e),this._id=t,this.name=c,this.initials=a,this.email=n},A=c("fXoL"),F=c("dNgK"),O=c("XiUz"),E=((a=function(){function e(t,c,a,n){_classCallCheck(this,e),this.data=t,this.dialogRef=c,this._userService=a,this.snackBar=n,this.sector=new B("","","","")}return _createClass(e,[{key:"ngOnInit",value:function(){this.buildSector(this.data.payload)}},{key:"buildSector",value:function(e){e&&(this.sector=e)}},{key:"openSnackBar",value:function(e,t){this.snackBar.open(e,t,{duration:1e4})}},{key:"submit",value:function(){if(!this.check())return this.openSnackBar("Faltan campos para completar","Cerrar");this.dialogRef.close({sector:this.sector})}},{key:"check",value:function(){return""!=this.sector.name&&""!=this.sector.initials&&""!=this.sector.email}}]),e}()).\u0275fac=function(e){return new(e||a)(A.Vb(w.a),A.Vb(w.g),A.Vb(x.a),A.Vb(F.a))},a.\u0275cmp=A.Pb({type:a,selectors:[["app-sector-popop"]],features:[A.Fb([{provide:j.c,useClass:I.c,deps:[j.g]},{provide:j.f,useValue:I.a},x.a])],decls:17,vars:4,consts:[["matDialogTitle",""],[1,"p-0"],["fxLayout","row wrap","fxLayout.lt-sm","column"],["fxFlex","100",1,"pr-1"],[1,"full-width"],["type","text","placeholder","Nombre","aria-label","Text","matInput","","name","name",3,"ngModel","ngModelChange"],["type","text","placeholder","Iniciales","aria-label","Text","matInput","","name","initials",3,"ngModel","ngModelChange"],["type","text","placeholder","Nombre","aria-label","Text","matInput","","name","email",3,"ngModel","ngModelChange"],["mat-raised-button","","color","primary",3,"click"]],template:function(e,t){1&e&&(A.bc(0,"h1",0),A.Vc(1),A.ac(),A.bc(2,"mat-card",1),A.bc(3,"mat-card-content"),A.bc(4,"form"),A.bc(5,"div",2),A.bc(6,"div",3),A.bc(7,"mat-form-field",4),A.bc(8,"input",5),A.jc("ngModelChange",(function(e){return t.sector.name=e})),A.ac(),A.ac(),A.ac(),A.bc(9,"div",3),A.bc(10,"mat-form-field",4),A.bc(11,"input",6),A.jc("ngModelChange",(function(e){return t.sector.initials=e})),A.ac(),A.ac(),A.ac(),A.bc(12,"div",3),A.bc(13,"mat-form-field",4),A.bc(14,"input",7),A.jc("ngModelChange",(function(e){return t.sector.email=e})),A.ac(),A.ac(),A.ac(),A.ac(),A.bc(15,"button",8),A.jc("click",(function(e){return t.submit()})),A.Vc(16,"Guardar"),A.ac(),A.ac(),A.ac(),A.ac()),2&e&&(A.Gb(1),A.Wc(t.data.title),A.Gb(7),A.uc("ngModel",t.sector.name),A.Gb(3),A.uc("ngModel",t.sector.initials),A.Gb(3),A.uc("ngModel",t.sector.email))},directives:[m.a,m.b,S.x,S.o,S.p,O.d,O.b,C.b,r.b,S.c,S.n,S.q,p.b],encapsulation:2}),a),q=c("3sEA");function P(e,t){if(1&e){var c=A.cc();A.bc(0,"div",5),A.bc(1,"button",6),A.jc("click",(function(e){return A.Mc(c),A.nc().toNew()})),A.Vc(2,"Nuevo"),A.ac(),A.ac()}}var D,N=((D=function(){function e(t,c,a,n,i,o,r){_classCallCheck(this,e),this._userService=t,this._sectorService=c,this._route=a,this._router=n,this.loader=i,this.snackBar=o,this.dialog=r,this.rows=[],this.columns=[],this.temp=[],this.canCreate=!1,this.token=t.getToken(),this.identity=t.getIdentity()}return _createClass(e,[{key:"ngOnInit",value:function(){this.getColumns(),this.getSectors(),"ROLE_ADMIN"==this.identity.role&&(this.canCreate=!0)}},{key:"getSectors",value:function(){var e=this;this._sectorService.getList(this.token).subscribe((function(t){t.sectors&&(e.rows=t.sectors,e.temp=t.sectors)}),(function(t){e.openSnackBar(t.message,"Cerrar")}))}},{key:"openSnackBar",value:function(e,t){this.snackBar.open(e,t,{duration:1e4})}},{key:"getColumns",value:function(){this.columns=[{prop:"name",name:"Nombre",flexGrow:2},{prop:"initials",name:"Iniciales",flexGrow:1},{prop:"email",name:"Email",flexGrow:2}]}},{key:"updateFilter",value:function(e){var t=e.target.value.toLowerCase(),c=Object.keys(this.temp[0]);if(c.splice(c.length-1),c.length){var a=this.temp.filter((function(e){for(var a=0;a<=c.length;a++){var n=c[a];if(e[n]&&e[n].toString().toLowerCase().indexOf(t)>-1)return!0}}));this.rows=a}}},{key:"toNew",value:function(){this.openPopUp(!0)}},{key:"openPopUp",value:function(e,t){var c=this;this.dialog.open(E,{width:"720px",disableClose:!1,data:{payload:t,title:e?"Nuevo sector":"Editar sector"}}).afterClosed().subscribe((function(t){t&&(c.loader.open(),e?c._sectorService.add(c.token,t.sector).subscribe((function(e){e.sector&&(c.openSnackBar("Sector creado","Cerrar"),c.getSectors())}),(function(e){c.openSnackBar(e.message,"Cerrar")})):c._sectorService.edit(c.token,t.sector._id,t.sector).subscribe((function(e){e.sector&&(c.openSnackBar("Sector actualizado","Cerrar"),c.getSectors())}),(function(e){c.openSnackBar(e.message,"Cerrar")})),c.loader.close())}))}},{key:"toProfile",value:function(e,t){"click"==e.type&&this.openPopUp(!1,e.row)}}]),e}()).\u0275fac=function(e){return new(e||D)(A.Vb(x.a),A.Vb(G.a),A.Vb(i.a),A.Vb(i.g),A.Vb(q.a),A.Vb(F.a),A.Vb(w.b))},D.\u0275cmp=A.Pb({type:D,selectors:[["app-sector-list"]],features:[A.Fb([x.a,G.a])],decls:5,vars:8,consts:[[1,"margin-333",2,"width","100%"],["matInput","","placeholder","Filtrar por todas las columnas","value","",3,"keyup"],["class","profile-actions mb-1","style","margin-left: 5px;",4,"ngIf"],[1,"mat-box-shadow","margin-333"],[1,"material","bg-white",3,"columnMode","headerHeight","footerHeight","rowHeight","limit","rows","columns","activate"],[1,"profile-actions","mb-1",2,"margin-left","5px"],["mat-raised-button","","color","primary",3,"click"]],template:function(e,t){1&e&&(A.bc(0,"mat-form-field",0),A.bc(1,"input",1),A.jc("keyup",(function(e){return t.updateFilter(e)})),A.ac(),A.ac(),A.Tc(2,P,3,0,"div",2),A.bc(3,"div",3),A.bc(4,"ngx-datatable",4),A.jc("activate",(function(e){return t.toProfile(e)})),A.ac(),A.ac()),2&e&&(A.Gb(2),A.uc("ngIf",t.canCreate),A.Gb(2),A.uc("columnMode","flex")("headerHeight",40)("footerHeight",50)("rowHeight",50)("limit",7)("rows",t.rows)("columns",t.columns))},directives:[C.b,r.b,n.m,b.d,p.b],encapsulation:2}),D),L=c("wd/R"),R=c("YFeJ"),U=c("Q2c7"),H=c("wkIo");function $(e,t){if(1&e){var c=A.cc();A.bc(0,"div",20),A.Wb(1,"img",21),A.bc(2,"button",22),A.jc("click",(function(e){return A.Mc(c),A.nc().openAttachment()})),A.bc(3,"mat-icon"),A.Vc(4,"edit"),A.ac(),A.ac(),A.ac()}}function X(e,t){if(1&e){var c=A.cc();A.bc(0,"div",20),A.Wb(1,"img",23),A.bc(2,"button",22),A.jc("click",(function(e){return A.Mc(c),A.nc().openAttachment()})),A.bc(3,"mat-icon"),A.Vc(4,"edit"),A.ac(),A.ac(),A.ac()}if(2&e){var a=A.nc();A.Gb(1),A.vc("src",a.url+"company/image/"+a.company.image,A.Oc)}}function W(e,t){if(1&e){var c=A.cc();A.bc(0,"mat-form-field",11),A.bc(1,"input",24),A.jc("ngModelChange",(function(e){return A.Mc(c),A.nc().company.password=e})),A.ac(),A.ac()}if(2&e){var a=A.nc();A.Gb(1),A.uc("readonly",!a.isAdmin)("ngModel",a.company.password)}}function z(e,t){if(1&e){var c=A.cc();A.bc(0,"mat-form-field",11),A.bc(1,"input",25),A.jc("ngModelChange",(function(e){return A.Mc(c),A.nc().company.chatScheduleFrom=e})),A.ac(),A.ac()}if(2&e){var a=A.nc();A.Gb(1),A.uc("readonly",!a.isAdmin)("ngModel",a.company.chatScheduleFrom)}}function K(e,t){if(1&e){var c=A.cc();A.bc(0,"mat-form-field",11),A.bc(1,"input",26),A.jc("ngModelChange",(function(e){return A.Mc(c),A.nc().company.chatScheduleTo=e})),A.ac(),A.ac()}if(2&e){var a=A.nc();A.Gb(1),A.uc("readonly",!a.isAdmin)("ngModel",a.company.chatScheduleTo)}}var Y,J,Q=((Y=function(){function e(t,c,a,n,i){_classCallCheck(this,e),this._userService=t,this._companyService=c,this._uploadService=a,this._route=n,this.snackBar=i,this.token=t.getToken(),this.identity=t.getIdentity(),this.url=R.a.url,this.isAdmin=!1}return _createClass(e,[{key:"ngOnInit",value:function(){this.getCompany()}},{key:"getCompany",value:function(){var e=this;this._companyService.getOne(this.token,this.identity.company._id).subscribe((function(t){t.company&&(e.company=t.company,"ROLE_ADMIN"==e.identity.role&&(e.isAdmin=!0))}),(function(t){e.openSnackBar(t.message,"Cerrar")}))}},{key:"editCompany",value:function(){var e=this;!this.company.chat||this.company.chat&&L(this.company.chatScheduleFrom,"HH:mm").isValid()&&L(this.company.chatScheduleTo,"HH:mm").isValid()?(0==this.company.mailSender&&(this.company.password=""),this._companyService.edit(this.token,this.company._id,this.company).subscribe((function(t){t.company&&e.openSnackBar("Datos actualizados","Cerrar")}),(function(t){e.openSnackBar(t.message,"Cerrar")}))):this.openSnackBar("Faltan campos para completar","Cerrar")}},{key:"openAttachment",value:function(){document.getElementById("attachment").click()}},{key:"openSnackBar",value:function(e,t){this.snackBar.open(e,t,{duration:1e4})}},{key:"fileChangeEvent",value:function(e){var t=this;this.filesToUpload=e.target.files,this._uploadService.makeFileRequest(this.url+"company/image/"+this.company._id,[],this.filesToUpload,this.token,"image"),setTimeout((function(){t.getCompany(),t.openSnackBar("Foto de departamento actualizada","Cerrar")}),1e3)}}]),e}()).\u0275fac=function(e){return new(e||Y)(A.Vb(x.a),A.Vb(H.a),A.Vb(U.a),A.Vb(i.a),A.Vb(F.a))},Y.\u0275cmp=A.Pb({type:Y,selectors:[["app-user-profile"]],features:[A.Fb([x.a,H.a,U.a])],decls:38,vars:16,consts:[["fxLayout","row wrap"],["fxFlex","100","fxFlex.gt-md","300px","fxFlex.gt-sm","50"],[1,"profile-sidebar","mb-1","pb-0"],["class","propic text-center",4,"ngIf"],["id","attachment","type","file","accept","image/*",2,"display","none",3,"change"],[1,"profile-title","text-center","mb-1",2,"margin-top","20px"],[1,"main-title"],["fxFlex","100","fxFlex.gt-sm","100","fxFlex.gt-md","calc(100% - 300px)"],[1,"p-0"],["label","Informaci\xf3n"],[1,"mt-1"],[1,"full-width"],["matInput","","name","name","type","text","placeholder","Nombre",3,"readonly","ngModel","ngModelChange"],["matInput","","name","email","type","text","placeholder","Email",3,"readonly","ngModel","ngModelChange"],["mat-raised-button","","color","primary",3,"click"],["label","Servidor de correo"],["name","mailSender",3,"ngModel","color","disabled","ngModelChange"],["class","full-width",4,"ngIf"],["label","Chat online"],["name","chat",3,"ngModel","color","disabled","ngModelChange"],[1,"propic","text-center"],["src","assets/images/system/company-placeholder.png"],["mat-mini-fab","","color","accent",2,"position","relative","left","-50px","top","50px",3,"click"],[3,"src"],["matInput","","name","name","type","password","placeholder","Contrase\xf1a",3,"readonly","ngModel","ngModelChange"],["matInput","","name","chatScheduleFrom","type","text","placeholder","08:30",3,"readonly","ngModel","ngModelChange"],["matInput","","name","chatScheduleTo","type","text","placeholder","18:00",3,"readonly","ngModel","ngModelChange"]],template:function(e,t){1&e&&(A.bc(0,"div",0),A.bc(1,"div",1),A.bc(2,"mat-card",2),A.Tc(3,$,5,0,"div",3),A.Tc(4,X,5,1,"div",3),A.bc(5,"input",4),A.jc("change",(function(e){return t.fileChangeEvent(e)})),A.ac(),A.bc(6,"div",5),A.bc(7,"div",6),A.Vc(8),A.ac(),A.ac(),A.ac(),A.ac(),A.bc(9,"div",7),A.bc(10,"mat-card",8),A.bc(11,"mat-tab-group"),A.bc(12,"mat-tab",9),A.bc(13,"mat-card-content",10),A.bc(14,"form"),A.bc(15,"mat-form-field",11),A.bc(16,"input",12),A.jc("ngModelChange",(function(e){return t.company.name=e})),A.ac(),A.ac(),A.bc(17,"mat-form-field",11),A.bc(18,"input",13),A.jc("ngModelChange",(function(e){return t.company.email=e})),A.ac(),A.ac(),A.ac(),A.bc(19,"button",14),A.jc("click",(function(e){return t.editCompany()})),A.Vc(20,"Guardar"),A.ac(),A.ac(),A.ac(),A.bc(21,"mat-tab",15),A.bc(22,"mat-card-content",10),A.bc(23,"form"),A.bc(24,"mat-checkbox",16),A.jc("ngModelChange",(function(e){return t.company.mailSender=e})),A.Vc(25,"Habilitar env\xedo de correos electr\xf3nicos "),A.ac(),A.Tc(26,W,2,2,"mat-form-field",17),A.ac(),A.bc(27,"button",14),A.jc("click",(function(e){return t.editCompany()})),A.Vc(28,"Guardar"),A.ac(),A.ac(),A.ac(),A.bc(29,"mat-tab",18),A.bc(30,"mat-card-content",10),A.bc(31,"form"),A.bc(32,"mat-checkbox",19),A.jc("ngModelChange",(function(e){return t.company.chat=e})),A.Vc(33,"Habilitar env\xedo de correos electr\xf3nicos "),A.ac(),A.Tc(34,z,2,2,"mat-form-field",17),A.Tc(35,K,2,2,"mat-form-field",17),A.ac(),A.bc(36,"button",14),A.jc("click",(function(e){return t.editCompany()})),A.Vc(37,"Guardar"),A.ac(),A.ac(),A.ac(),A.ac(),A.ac(),A.ac(),A.ac()),2&e&&(A.Gb(3),A.uc("ngIf","null"==t.company.image),A.Gb(1),A.uc("ngIf","null"!=t.company.image),A.Gb(4),A.Wc(t.company.name),A.Gb(8),A.uc("readonly",!t.isAdmin)("ngModel",t.company.name),A.Gb(2),A.uc("readonly",!t.isAdmin)("ngModel",t.company.email),A.Gb(6),A.uc("ngModel",t.company.mailSender)("color","primary")("disabled",!t.isAdmin),A.Gb(2),A.uc("ngIf",t.company.mailSender),A.Gb(6),A.uc("ngModel",t.company.chat)("color","primary")("disabled",!t.isAdmin),A.Gb(2),A.uc("ngIf",t.company.chat),A.Gb(1),A.uc("ngIf",t.company.chat))},directives:[O.d,O.b,m.a,n.m,f.b,f.a,m.b,S.x,S.o,S.p,C.b,r.b,S.c,S.n,S.q,p.b,o.a,d.a],encapsulation:2}),Y),Z=c("rpG9"),ee=c("Xwq+"),te=function e(t,c,a){_classCallCheck(this,e),this._id=t,this.name=c,this.company=a},ce=function e(t,c,a,n,i,o,r,s,u,l,b,d,p){_classCallCheck(this,e),this._id=t,this.name=c,this.team=a,this.resolveDays=n,this.typeTicket=i,this.checks=o,this.goodChecks=r,this.requireAttach=s,this.desc=u,this.autoSub=l,this.autoDesc=b,this.autoChange=d,this.workTime=p},ae=c("3kSh"),ne=((J=function(){function e(t,c){_classCallCheck(this,e),this.data=t,this.dialogRef=c,this.type=new te("","","")}return _createClass(e,[{key:"ngOnInit",value:function(){this.build(this.data.payload)}},{key:"build",value:function(e){e&&(this.type=e)}},{key:"submit",value:function(){this.dialogRef.close({type:this.type})}}]),e}()).\u0275fac=function(e){return new(e||J)(A.Vb(w.a),A.Vb(w.g))},J.\u0275cmp=A.Pb({type:J,selectors:[["app-type-popup"]],features:[A.Fb([{provide:j.c,useClass:I.c,deps:[j.g]},{provide:j.f,useValue:I.a}])],decls:12,vars:2,consts:[["matDialogTitle",""],[1,"p-0"],["fxLayout","row wrap","fxLayout.lt-sm","column"],["fxFlex","100",1,"pr-1"],[1,"full-width"],["type","text","placeholder","Nombre","aria-label","Text","matInput","","name","name",3,"ngModel","ngModelChange"],["fxLayout","row"],["mat-raised-button","","color","primary","matStepperNext","",3,"click"]],template:function(e,t){1&e&&(A.bc(0,"h1",0),A.Vc(1),A.ac(),A.bc(2,"mat-card",1),A.bc(3,"mat-card-content"),A.bc(4,"form"),A.bc(5,"div",2),A.bc(6,"div",3),A.bc(7,"mat-form-field",4),A.bc(8,"input",5),A.jc("ngModelChange",(function(e){return t.type.name=e})),A.ac(),A.ac(),A.ac(),A.bc(9,"div",6),A.bc(10,"button",7),A.jc("click",(function(e){return t.submit()})),A.Vc(11,"Guardar"),A.ac(),A.ac(),A.ac(),A.ac(),A.ac(),A.ac()),2&e&&(A.Gb(1),A.Wc(t.data.title),A.Gb(7),A.uc("ngModel",t.type.name))},directives:[m.a,m.b,S.x,S.o,S.p,O.d,O.b,C.b,r.b,S.c,S.n,S.q,p.b],encapsulation:2}),J);function ie(e,t){if(1&e&&(A.bc(0,"div",8),A.Vc(1),A.ac()),2&e){var c=A.nc().$implicit;A.Gb(1),A.Xc(" ",c.team.name," ")}}var oe=function(e){return["/settings/ticket/subtype",e]};function re(e,t){if(1&e&&(A.bc(0,"mat-list-item"),A.bc(1,"button",7),A.bc(2,"a",3),A.bc(3,"mat-icon",1),A.Vc(4,"settings"),A.ac(),A.ac(),A.ac(),A.bc(5,"div",8),A.Vc(6),A.ac(),A.Tc(7,ie,2,1,"div",9),A.ac()),2&e){var c=t.$implicit;A.Gb(2),A.uc("routerLink",A.Ac(3,oe,c._id)),A.Gb(4),A.Wc(c.name),A.Gb(1),A.uc("ngIf",c.team)}}var se=function(e){return["/settings/ticket/newsubtype",e]};function ue(e,t){if(1&e){var c=A.cc();A.bc(0,"mat-expansion-panel"),A.bc(1,"mat-expansion-panel-header"),A.Vc(2),A.ac(),A.bc(3,"mat-list"),A.Tc(4,re,8,5,"mat-list-item",2),A.bc(5,"mat-list-item"),A.bc(6,"a",3),A.bc(7,"button",4),A.bc(8,"mat-icon",1),A.Vc(9,"add"),A.ac(),A.ac(),A.ac(),A.bc(10,"button",5),A.jc("click",(function(e){A.Mc(c);var a=t.$implicit;return A.nc().openPopUp(a,!1)})),A.bc(11,"mat-icon",1),A.Vc(12,"settings"),A.ac(),A.ac(),A.bc(13,"button",6),A.jc("click",(function(e){A.Mc(c);var a=t.$implicit;return A.nc().deleteType(a)})),A.bc(14,"mat-icon",1),A.Vc(15,"delete"),A.ac(),A.ac(),A.ac(),A.ac(),A.ac()}if(2&e){var a=t.$implicit,n=t.index,i=A.nc();A.Gb(2),A.Xc(" ",a.name," "),A.Gb(2),A.uc("ngForOf",i.subtypes[n]),A.Gb(2),A.uc("routerLink",A.Ac(6,se,a._id)),A.Gb(1),A.uc("matTooltip","Nuevo subtipo en "+a.name),A.Gb(3),A.uc("matTooltip","Configurar tipo "+a.name),A.Gb(3),A.uc("matTooltip","Eliminar tipo "+a.name)}}var le,be=((le=function(){function e(t,c,a,n,i,o,r){_classCallCheck(this,e),this.dialog=t,this.loader=c,this._userService=a,this._typeTicketService=n,this._subTypeTicketService=i,this.confirmService=o,this.snackBar=r,this.token=a.getToken(),this.identity=a.getIdentity(),this.url=R.a.url,this.subtypes=new Array,this.newType=new te("","",this.identity.company._id),this.newSubtype=new ce("","","",0,"",String[""],0,!1,"","","",!1,null)}return _createClass(e,[{key:"ngOnInit",value:function(){this.getTypes()}},{key:"getTypes",value:function(){var e=this;this._typeTicketService.getList(this.token,this.identity.company._id).subscribe((function(t){if(t.typeTickets){e.types=t.typeTickets;for(var c=0;c<e.types.length;c++)e.getSubTypes(e.types[c]._id,c)}}),(function(t){e.openSnackBar(t.message,"Cerrar")}))}},{key:"getSubTypes",value:function(e,t){var c=this;this._subTypeTicketService.getList(this.token,e).subscribe((function(e){e.subTypeTickets&&c.subtypes.push(e.subTypeTickets)}),(function(e){c.openSnackBar(e.message,"Cerrar")}))}},{key:"deleteType",value:function(e){var t=this;this.confirmService.confirm({message:"\xbfEstas seguro que quieres eliminar el tipo "+e.name+"?"}).subscribe((function(c){c&&t._typeTicketService.delete(t.token,e._id).subscribe((function(e){e.typeTicket&&(t.getTypes(),t.openSnackBar("Tipo eliminado","Cerrar"))}),(function(e){t.openSnackBar(e.message,"Cerrar")}))}))}},{key:"addType",value:function(e){var t=this,c=new te("",e,this.identity.company._id);this._typeTicketService.add(this.token,c).subscribe((function(e){e.typeTicket&&(t.getTypes(),t.openSnackBar("Tipo de ticket a\xf1adido","Cerrar"))}),(function(e){t.openSnackBar(e.message,"Cerrar")}))}},{key:"editType",value:function(e,t){var c=this,a=new te(e,t,this.identity.company._id);this._typeTicketService.edit(this.token,e,a).subscribe((function(e){e.typeTicket&&(c.getTypes(),c.openSnackBar("Tipo de ticket editado","Cerrar"))}),(function(e){c.openSnackBar(e.message,"Cerrar")}))}},{key:"openPopUp",value:function(e,t){var c=this;this.dialog.open(ne,{width:"500px",data:{payload:e,title:t?"Nuevo tipo de ticket":"Editar tipo de ticket"}}).afterClosed().subscribe((function(e){e&&(c.loader.open(),t?c.addType(e.type.name):c.editType(e.type._id,e.type.name),c.loader.close())}))}},{key:"openSnackBar",value:function(e,t){this.snackBar.open(e,t,{duration:1e4})}}]),e}()).\u0275fac=function(e){return new(e||le)(A.Vb(w.b),A.Vb(q.a),A.Vb(x.a),A.Vb(Z.a),A.Vb(ee.a),A.Vb(ae.a),A.Vb(F.a))},le.\u0275cmp=A.Pb({type:le,selectors:[["app-type-ticket"]],features:[A.Fb([x.a,Z.a,ee.a])],decls:6,vars:1,consts:[["mat-raised-button","","matTooltip","Nuevo tipo de ticket","color","primary",3,"click"],["mat-list-icon",""],[4,"ngFor","ngForOf"],[3,"routerLink"],["mat-raised-button","","color","primary",3,"matTooltip"],["mat-raised-button","","color","accent",3,"matTooltip","click"],["mat-raised-button","","color","warn",3,"matTooltip","click"],["mat-icon-button","","matTooltip","Configurar subtipo","color","accent"],["mat-line",""],["mat-line","",4,"ngIf"]],template:function(e,t){1&e&&(A.bc(0,"mat-card"),A.bc(1,"button",0),A.jc("click",(function(e){return t.openPopUp(null,!0)})),A.bc(2,"mat-icon",1),A.Vc(3,"add"),A.ac(),A.ac(),A.ac(),A.bc(4,"mat-accordion"),A.Tc(5,ue,16,8,"mat-expansion-panel",2),A.ac()),2&e&&(A.Gb(5),A.uc("ngForOf",t.types))},directives:[m.a,p.b,_.a,d.a,y.b,g.a,n.l,g.c,g.d,y.a,y.c,i.j,j.l,n.m],styles:[".item[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:hover{background-color:#d3d3d3}"]}),le),de=c("3uMe"),pe=c("CzEO");function me(e,t){if(1&e&&(A.bc(0,"mat-label"),A.Vc(1),A.ac()),2&e){var c=A.nc();A.Gb(1),A.Wc(c.subtype.team.name)}}function he(e,t){1&e&&(A.bc(0,"mat-label"),A.Vc(1,"Sin equipo"),A.ac())}function fe(e,t){if(1&e){var c=A.cc();A.bc(0,"mat-option",22),A.jc("click",(function(e){A.Mc(c);var a=t.$implicit;return A.nc().setTeam(a._id)})),A.Vc(1),A.ac()}if(2&e){var a=t.$implicit;A.uc("value",a._id),A.Gb(1),A.Xc("",a.name," ")}}function ge(e,t){1&e&&(A.bc(0,"th"),A.Vc(1,"Editar"),A.ac())}function ye(e,t){if(1&e){var c=A.cc();A.bc(0,"td",24),A.bc(1,"button",25),A.jc("click",(function(e){A.Mc(c);var t=A.nc().$implicit;return A.nc().deleteCheck(t)})),A.bc(2,"mat-icon",26),A.Vc(3,"delete"),A.ac(),A.ac(),A.ac()}}function ke(e,t){if(1&e&&(A.bc(0,"tr"),A.bc(1,"td"),A.Vc(2),A.ac(),A.Tc(3,ye,4,0,"td",23),A.ac()),2&e){var c=t.$implicit,a=A.nc();A.Gb(2),A.Xc(" ",c," "),A.Gb(1),A.uc("ngIf",a.isAdmin)}}function ve(e,t){if(1&e){var c=A.cc();A.bc(0,"tfoot"),A.bc(1,"tr"),A.bc(2,"td"),A.bc(3,"input",27),A.jc("ngModelChange",(function(e){return A.Mc(c),A.nc().check=e})),A.ac(),A.ac(),A.bc(4,"td",24),A.bc(5,"button",28),A.jc("click",(function(e){return A.Mc(c),A.nc().addCheck()})),A.bc(6,"mat-icon",26),A.Vc(7,"add"),A.ac(),A.ac(),A.ac(),A.ac(),A.ac()}if(2&e){var a=A.nc();A.Gb(3),A.uc("ngModel",a.check)}}function Ce(e,t){if(1&e&&(A.bc(0,"mat-label"),A.Vc(1),A.ac()),2&e){var c=A.nc();A.Gb(1),A.Wc(c.subtype.team.name)}}function Te(e,t){1&e&&(A.bc(0,"mat-label"),A.Vc(1,"Sin equipo"),A.ac())}function Se(e,t){if(1&e){var c=A.cc();A.bc(0,"mat-option",22),A.jc("click",(function(e){A.Mc(c);var a=t.$implicit;return A.nc().setTeam(a._id)})),A.Vc(1),A.ac()}if(2&e){var a=t.$implicit;A.uc("value",a._id),A.Gb(1),A.Xc("",a.name," ")}}function Me(e,t){1&e&&(A.bc(0,"th"),A.Vc(1,"Editar"),A.ac())}function _e(e,t){if(1&e){var c=A.cc();A.bc(0,"td",24),A.bc(1,"button",25),A.jc("click",(function(e){A.Mc(c);var t=A.nc().$implicit;return A.nc().deleteCheck(t)})),A.bc(2,"mat-icon",26),A.Vc(3,"delete"),A.ac(),A.ac(),A.ac()}}function Ve(e,t){if(1&e&&(A.bc(0,"tr"),A.bc(1,"td"),A.Vc(2),A.ac(),A.Tc(3,_e,4,0,"td",23),A.ac()),2&e){var c=t.$implicit,a=A.nc();A.Gb(2),A.Xc(" ",c," "),A.Gb(1),A.uc("ngIf",a.isAdmin)}}function xe(e,t){if(1&e){var c=A.cc();A.bc(0,"tfoot"),A.bc(1,"tr"),A.bc(2,"td"),A.bc(3,"input",27),A.jc("ngModelChange",(function(e){return A.Mc(c),A.nc().check=e})),A.ac(),A.ac(),A.bc(4,"td",24),A.bc(5,"button",28),A.jc("click",(function(e){return A.Mc(c),A.nc().addCheck()})),A.bc(6,"mat-icon",26),A.Vc(7,"add"),A.ac(),A.ac(),A.ac(),A.ac(),A.ac()}if(2&e){var a=A.nc();A.Gb(3),A.uc("ngModel",a.check)}}var Ge,we,Ie=[{path:"",children:[{path:"list/sector",component:N,data:{title:"Lista de sectores",breadcrumb:"LISTA DE SECTORES"}},{path:"company",component:Q,data:{title:"Departamento",breadcrumb:"DEPARTAMENTO"}},{path:"ticket/types",component:be,data:{title:"Tipos y subtipos de ticket",breadcrumb:"TIPOS Y SUBTIPOS DE TICKETS"}},{path:"ticket/subtype/:id",component:(we=function(){function e(t,c,a,n,i,o){_classCallCheck(this,e),this._userService=t,this._teamService=c,this.confirmService=a,this._route=n,this._subTypeTicketService=i,this.snackBar=o,this.isAdmin=!1,this.token=t.getToken(),this.identity=t.getIdentity(),this.subtype=new ce("","","",null,"",[],null,!1,"","","",!1,null),this.check=""}return _createClass(e,[{key:"ngOnInit",value:function(){this.getSubType(),this.getTeams(),"ROLE_ADMIN"==this.identity.role&&(this.isAdmin=!0)}},{key:"getSubType",value:function(){var e=this;this._route.params.forEach((function(t){e._subTypeTicketService.getOne(e.token,t.id).subscribe((function(t){t.subTypeTicket&&(e.subtype=t.subTypeTicket)}),(function(t){e.openSnackBar(t.message,"Cerrar")}))}))}},{key:"getTeams",value:function(){var e=this;this._teamService.getList(this.token,this.identity.company._id).subscribe((function(t){t.teams&&(e.teams=t.teams)}),(function(t){e.openSnackBar(t.message,"Cerrar")}))}},{key:"setTeam",value:function(e){this.subtype.team=e}},{key:"submit",value:function(){var e=this;""!=this.subtype.name?this._subTypeTicketService.edit(this.token,this.subtype._id,this.subtype).subscribe((function(t){t.subTypeTicket&&e.openSnackBar("Datos actualizados","Cerrar")}),(function(t){e.openSnackBar(t.message,"Cerrar")})):this.openSnackBar("Faltan campos para completar","Cerrar")}},{key:"deleteCheck",value:function(e){var t=this;this.confirmService.confirm({message:"\xbfEstas seguro que quieres eliminar esta validaci\xf3n?"}).subscribe((function(c){c&&t._subTypeTicketService.deleteCheck(t.token,t.subtype._id,e).subscribe((function(c){c.check&&(t.subtype.checks.splice(t.subtype.checks.indexOf(e),1),t.openSnackBar("Validaci\xf3n eliminada","Cerrar"))}),(function(e){t.openSnackBar(e.message,"Cerrar")}))}))}},{key:"addCheck",value:function(){var e=this;this._subTypeTicketService.addCheck(this.token,this.subtype._id,this.check).subscribe((function(t){t.subTypeTicket&&(e.subtype.checks.push(e.check),e.check="",e.openSnackBar("Validaci\xf3n agregada","Cerrar"))}),(function(t){e.openSnackBar(t.message,"Cerrar")}))}},{key:"openSnackBar",value:function(e,t){this.snackBar.open(e,t,{duration:1e4})}}]),e}(),we.\u0275fac=function(e){return new(e||we)(A.Vb(x.a),A.Vb(de.a),A.Vb(ae.a),A.Vb(i.a),A.Vb(ee.a),A.Vb(F.a))},we.\u0275cmp=A.Pb({type:we,selectors:[["app-subtype"]],features:[A.Fb([{provide:j.c,useClass:I.c,deps:[j.g]},{provide:j.f,useValue:I.a},x.a,ee.a,de.a])],decls:44,vars:20,consts:[["fxLayout","row wrap"],["fxFlex","100"],[1,"p-0"],["label","General"],[1,"mt-1"],[1,"full-width"],["matInput","","name","name","type","text","placeholder","Nombre",3,"readonly","ngModel","ngModelChange"],["appearance","fill",1,"full-width"],[4,"ngIf"],[3,"value","click",4,"ngFor","ngForOf"],["matInput","","name","desc","type","text","placeholder","Descripci\xf3n",3,"readonly","ngModel","ngModelChange"],["name","requireAttach",3,"ngModel","color","disabled","ngModelChange"],["mat-raised-button","","color","primary",3,"click"],["label","Validaciones",3,"disabled"],[1,"form-group"],[1,"table-responsive"],[1,"table"],[4,"ngFor","ngForOf"],["label","Autocompletado"],["name","autoChange",3,"ngModel","color","disabled","ngModelChange"],["matInput","","name","sub","type","text","placeholder","Asunto",3,"readonly","ngModel","ngModelChange"],["theme","snow","name","autoDesc",3,"ngModel","ngModelChange"],[3,"value","click"],["class","text-center",4,"ngIf"],[1,"text-center"],["mat-icon-button","","matTooltip","Eliminar validaci\xf3n","color","warn",3,"click"],["mat-list-icon",""],["type","text","placeholder","Ingrese una validaci\xf3n","name","check","required","",1,"form-control","form-control-lg",3,"ngModel","ngModelChange"],["mat-icon-button","","matTooltip","Agregar","color","primary",3,"click"]],template:function(e,t){1&e&&(A.bc(0,"div",0),A.bc(1,"div",1),A.bc(2,"mat-card",2),A.bc(3,"mat-tab-group"),A.bc(4,"mat-tab",3),A.bc(5,"mat-card-content",4),A.bc(6,"form"),A.bc(7,"mat-form-field",5),A.bc(8,"input",6),A.jc("ngModelChange",(function(e){return t.subtype.name=e})),A.ac(),A.ac(),A.bc(9,"mat-form-field",7),A.Tc(10,me,2,1,"mat-label",8),A.Tc(11,he,2,0,"mat-label",8),A.bc(12,"mat-select"),A.Tc(13,fe,2,2,"mat-option",9),A.ac(),A.ac(),A.bc(14,"mat-form-field",5),A.bc(15,"input",10),A.jc("ngModelChange",(function(e){return t.subtype.desc=e})),A.ac(),A.ac(),A.bc(16,"mat-checkbox",11),A.jc("ngModelChange",(function(e){return t.subtype.requireAttach=e})),A.Vc(17,"Requiere adjunto "),A.ac(),A.ac(),A.bc(18,"button",12),A.jc("click",(function(e){return t.submit()})),A.Vc(19,"Guardar"),A.ac(),A.ac(),A.ac(),A.bc(20,"mat-tab",13),A.bc(21,"mat-card-content",4),A.bc(22,"div",14),A.bc(23,"div",15),A.bc(24,"table",16),A.bc(25,"thead"),A.bc(26,"tr"),A.bc(27,"th"),A.Vc(28,"Descripci\xf3n"),A.ac(),A.Tc(29,ge,2,0,"th",8),A.ac(),A.ac(),A.bc(30,"tbody"),A.Tc(31,ke,4,2,"tr",17),A.ac(),A.Tc(32,ve,8,1,"tfoot",8),A.ac(),A.ac(),A.ac(),A.ac(),A.ac(),A.bc(33,"mat-tab",18),A.bc(34,"mat-card-content",4),A.bc(35,"form"),A.bc(36,"mat-checkbox",19),A.jc("ngModelChange",(function(e){return t.subtype.autoChange=e})),A.Vc(37,"Requiere modificaci\xf3n "),A.ac(),A.bc(38,"mat-form-field",5),A.bc(39,"input",20),A.jc("ngModelChange",(function(e){return t.subtype.autoSub=e})),A.ac(),A.ac(),A.bc(40,"mat-card-content",2),A.bc(41,"quill-editor",21),A.jc("ngModelChange",(function(e){return t.subtype.autoDesc=e})),A.ac(),A.ac(),A.ac(),A.bc(42,"button",12),A.jc("click",(function(e){return t.submit()})),A.Vc(43,"Guardar"),A.ac(),A.ac(),A.ac(),A.ac(),A.ac(),A.ac(),A.ac()),2&e&&(A.Gb(8),A.uc("readonly",!t.isAdmin)("ngModel",t.subtype.name),A.Gb(2),A.uc("ngIf",t.subtype.team),A.Gb(1),A.uc("ngIf",!t.subtype.team),A.Gb(2),A.uc("ngForOf",t.teams),A.Gb(2),A.uc("readonly",!t.isAdmin)("ngModel",t.subtype.desc),A.Gb(1),A.uc("ngModel",t.subtype.requireAttach)("color","primary")("disabled",!t.isAdmin),A.Gb(4),A.uc("disabled",""==t.subtype._id),A.Gb(9),A.uc("ngIf",t.isAdmin),A.Gb(2),A.uc("ngForOf",t.subtype.checks),A.Gb(1),A.uc("ngIf",t.isAdmin),A.Gb(4),A.uc("ngModel",t.subtype.autoChange)("color","primary")("disabled",!t.isAdmin),A.Gb(3),A.uc("readonly",!t.isAdmin)("ngModel",t.subtype.autoSub),A.Gb(2),A.uc("ngModel",t.subtype.autoDesc))},directives:[O.d,O.b,m.a,f.b,f.a,m.b,S.x,S.o,S.p,C.b,r.b,S.c,S.n,S.q,n.m,T.a,n.l,o.a,p.b,pe.a,C.e,j.p,_.a,d.a,y.b,S.u],encapsulation:2}),we),data:{title:"Subtipo de ticket",breadcrumb:"SUBTIPO DE TICKET"}},{path:"ticket/newsubtype/:id",component:(Ge=function(){function e(t,c,a,n,i,o,r){_classCallCheck(this,e),this._userService=t,this._teamService=c,this.confirmService=a,this._route=n,this._subTypeTicketService=i,this.snackBar=o,this._router=r,this.isAdmin=!0,this.token=t.getToken(),this.identity=t.getIdentity(),this.subtype=new ce("","","",null,"",[],null,!1,"","","",!1,null),this.check=""}return _createClass(e,[{key:"ngOnInit",value:function(){this.build(),this.getTeams()}},{key:"build",value:function(){var e=this;this._route.params.forEach((function(t){e.subtype.typeTicket=t.id}))}},{key:"getTeams",value:function(){var e=this;this._teamService.getList(this.token,this.identity.company._id).subscribe((function(t){t.teams&&(e.teams=t.teams)}),(function(t){e.openSnackBar(t.message,"Cerrar")}))}},{key:"setTeam",value:function(e){this.subtype.team=e}},{key:"submit",value:function(){var e=this;""!=this.subtype.name?(""==this.subtype.team&&delete this.subtype.team,this._subTypeTicketService.add(this.token,this.subtype).subscribe((function(t){t.subTypeTicket&&(e.openSnackBar("Subtipo creado","Cerrar"),e._router.navigate(["/settings/ticket/types"]))}),(function(t){e.openSnackBar(t.message,"Cerrar")}))):this.openSnackBar("Faltan campos para completar","Cerrar")}},{key:"deleteCheck",value:function(e){var t=this;this.confirmService.confirm({message:"\xbfEstas seguro que quieres eliminar esta validaci\xf3n?"}).subscribe((function(c){c&&t._subTypeTicketService.deleteCheck(t.token,t.subtype._id,e).subscribe((function(c){c.check&&(t.subtype.checks.splice(t.subtype.checks.indexOf(e),1),t.openSnackBar("Validaci\xf3n eliminada","Cerrar"))}),(function(e){t.openSnackBar(e.message,"Cerrar")}))}))}},{key:"addCheck",value:function(){var e=this;this._subTypeTicketService.addCheck(this.token,this.subtype._id,this.check).subscribe((function(t){t.subTypeTicket&&(e.subtype.checks.push(e.check),e.check="",e.openSnackBar("Validaci\xf3n agregada","Cerrar"))}),(function(t){e.openSnackBar(t.message,"Cerrar")}))}},{key:"openSnackBar",value:function(e,t){this.snackBar.open(e,t,{duration:1e4})}}]),e}(),Ge.\u0275fac=function(e){return new(e||Ge)(A.Vb(x.a),A.Vb(de.a),A.Vb(ae.a),A.Vb(i.a),A.Vb(ee.a),A.Vb(F.a),A.Vb(i.g))},Ge.\u0275cmp=A.Pb({type:Ge,selectors:[["app-subtype"]],features:[A.Fb([{provide:j.c,useClass:I.c,deps:[j.g]},{provide:j.f,useValue:I.a},x.a,ee.a,de.a])],decls:44,vars:20,consts:[["fxLayout","row wrap"],["fxFlex","100"],[1,"p-0"],["label","General"],[1,"mt-1"],[1,"full-width"],["matInput","","name","name","type","text","placeholder","Nombre",3,"readonly","ngModel","ngModelChange"],["appearance","fill",1,"full-width"],[4,"ngIf"],[3,"value","click",4,"ngFor","ngForOf"],["matInput","","name","desc","type","text","placeholder","Descripci\xf3n",3,"readonly","ngModel","ngModelChange"],["name","requireAttach",3,"ngModel","color","disabled","ngModelChange"],["mat-raised-button","","color","primary",3,"click"],["label","Validaciones",3,"disabled"],[1,"form-group"],[1,"table-responsive"],[1,"table"],[4,"ngFor","ngForOf"],["label","Autocompletado"],["name","autoChange",3,"ngModel","color","disabled","ngModelChange"],["matInput","","name","sub","type","text","placeholder","Asunto",3,"readonly","ngModel","ngModelChange"],["theme","snow","name","autoDesc",3,"ngModel","ngModelChange"],[3,"value","click"],["class","text-center",4,"ngIf"],[1,"text-center"],["mat-icon-button","","matTooltip","Eliminar validaci\xf3n","color","warn",3,"click"],["mat-list-icon",""],["type","text","placeholder","Ingrese una validaci\xf3n","name","check","required","",1,"form-control","form-control-lg",3,"ngModel","ngModelChange"],["mat-icon-button","","matTooltip","Agregar","color","primary",3,"click"]],template:function(e,t){1&e&&(A.bc(0,"div",0),A.bc(1,"div",1),A.bc(2,"mat-card",2),A.bc(3,"mat-tab-group"),A.bc(4,"mat-tab",3),A.bc(5,"mat-card-content",4),A.bc(6,"form"),A.bc(7,"mat-form-field",5),A.bc(8,"input",6),A.jc("ngModelChange",(function(e){return t.subtype.name=e})),A.ac(),A.ac(),A.bc(9,"mat-form-field",7),A.Tc(10,Ce,2,1,"mat-label",8),A.Tc(11,Te,2,0,"mat-label",8),A.bc(12,"mat-select"),A.Tc(13,Se,2,2,"mat-option",9),A.ac(),A.ac(),A.bc(14,"mat-form-field",5),A.bc(15,"input",10),A.jc("ngModelChange",(function(e){return t.subtype.desc=e})),A.ac(),A.ac(),A.bc(16,"mat-checkbox",11),A.jc("ngModelChange",(function(e){return t.subtype.requireAttach=e})),A.Vc(17,"Requiere adjunto "),A.ac(),A.ac(),A.bc(18,"button",12),A.jc("click",(function(e){return t.submit()})),A.Vc(19,"Guardar"),A.ac(),A.ac(),A.ac(),A.bc(20,"mat-tab",13),A.bc(21,"mat-card-content",4),A.bc(22,"div",14),A.bc(23,"div",15),A.bc(24,"table",16),A.bc(25,"thead"),A.bc(26,"tr"),A.bc(27,"th"),A.Vc(28,"Descripci\xf3n"),A.ac(),A.Tc(29,Me,2,0,"th",8),A.ac(),A.ac(),A.bc(30,"tbody"),A.Tc(31,Ve,4,2,"tr",17),A.ac(),A.Tc(32,xe,8,1,"tfoot",8),A.ac(),A.ac(),A.ac(),A.ac(),A.ac(),A.bc(33,"mat-tab",18),A.bc(34,"mat-card-content",4),A.bc(35,"form"),A.bc(36,"mat-checkbox",19),A.jc("ngModelChange",(function(e){return t.subtype.autoChange=e})),A.Vc(37,"Requiere modificaci\xf3n "),A.ac(),A.bc(38,"mat-form-field",5),A.bc(39,"input",20),A.jc("ngModelChange",(function(e){return t.subtype.autoSub=e})),A.ac(),A.ac(),A.bc(40,"mat-card-content",2),A.bc(41,"quill-editor",21),A.jc("ngModelChange",(function(e){return t.subtype.autoDesc=e})),A.ac(),A.ac(),A.ac(),A.bc(42,"button",12),A.jc("click",(function(e){return t.submit()})),A.Vc(43,"Guardar"),A.ac(),A.ac(),A.ac(),A.ac(),A.ac(),A.ac(),A.ac()),2&e&&(A.Gb(8),A.uc("readonly",!t.isAdmin)("ngModel",t.subtype.name),A.Gb(2),A.uc("ngIf",t.subtype.team),A.Gb(1),A.uc("ngIf",!t.subtype.team),A.Gb(2),A.uc("ngForOf",t.teams),A.Gb(2),A.uc("readonly",!t.isAdmin)("ngModel",t.subtype.desc),A.Gb(1),A.uc("ngModel",t.subtype.requireAttach)("color","primary")("disabled",!t.isAdmin),A.Gb(4),A.uc("disabled",""==t.subtype._id),A.Gb(9),A.uc("ngIf",t.isAdmin),A.Gb(2),A.uc("ngForOf",t.subtype.checks),A.Gb(1),A.uc("ngIf",t.isAdmin),A.Gb(4),A.uc("ngModel",t.subtype.autoChange)("color","primary")("disabled",!t.isAdmin),A.Gb(3),A.uc("readonly",!t.isAdmin)("ngModel",t.subtype.autoSub),A.Gb(2),A.uc("ngModel",t.subtype.autoDesc))},directives:[O.d,O.b,m.a,f.b,f.a,m.b,S.x,S.o,S.p,C.b,r.b,S.c,S.n,S.q,n.m,T.a,n.l,o.a,p.b,pe.a,C.e,j.p,_.a,d.a,y.b,S.u],encapsulation:2}),Ge),data:{title:"Nuevo subtipo",breadcrumb:"NUEVO SUBTIPO"}}]}];c.d(t,"AppSettingsModule",(function(){return Be}));var je,Be=((je=function e(){_classCallCheck(this,e)}).\u0275mod=A.Tb({type:je}),je.\u0275inj=A.Sb({factory:function(e){return new(e||je)},imports:[[n.c,S.t,C.d,pe.b,S.j,h.b,u.a,g.b,T.b,s.a,l.k,V.a,y.d,_.b,d.b,p.c,m.c,M.a,o.b,f.c,r.c,k.a,b.e,v.a,i.k.forChild(Ie)]]}),je)}}]);