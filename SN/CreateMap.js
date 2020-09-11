//var input  = "10,1 100,2 200,3 500,4 1000,5" ;
var input  = "10,1 500,2 500,3 2000,4 2000,5 2000,6 3000,7" ;
//added connections to level
var addedConns = "2,7000";
var endPoint = 2 ;
createMap( input);
//clean1();

function createMap( input) {
    createBaseMap();
    createCI( input);
    buildCons(input);
}

function attachEnd(endPoint)  {
    var i ,gr1,gr , name , linux_sys_id , linux_sys_id2 ;
    var gr2 = new GlideRecord("cmdb_ci_service");
    gr2.addQuery("name","NoasService");
    gr2.query();
    gr2.next();
    var service_sys_id= gr2.getValue("sys_id");
 
    var importer = new CreateOrUpdateITService();

    for (i = 0; i < parseInt(endPoint) ; i++) {
        gr = new GlideRecord('cmdb_ci_linux_server');
        gr.initialize();
        name = 'tryBase_' + i;
        gr.name = name ;
        gr.insert();
        gr1 = new GlideRecord('cmdb_ci_linux_server');
        gr1.addQuery("name",name);
        gr1.query();
        gr1.next();
        linux_sys_id = gr1.getValue("sys_id"); 
        importer.addCI(service_sys_id, "null" , linux_sys_id);  
    }
}




function createBaseMap( ) {
    var gr = new GlideRecord('cmdb_ci_linux_server');
    gr.initialize();
    gr.name = 'tryBase' ;  
    gr.insert(); 
    var linux_1_sys_id;
    var gr1 = new GlideRecord("cmdb_ci_linux_server");
    gr1.addQuery("name","tryBase");
    gr1.query();
    gr1.next();
    linux_1_sys_id = gr1.getValue("sys_id");
    var payload = "{ " +
    "\"name\": \"NoasService\", " +
    "\"comments\": \"comments ...\", " +
    "\"service_relations\": [ " +
    "{ \"parent\": \"\", " +
    "\"child\": \"" + linux_1_sys_id + "\" " +
    "} " +
    "] " +
    "}" ;
    gs.print(payload);
    var importer = new CreateOrUpdateITService();
    importer.processJSON(payload);
}

function createCI(input) {
    var res = input.split(" ");
    var numOfCis = 0 ;
    for (i = 0; i < res.length; i++) {
        tmp =  res[i].split(",");
        numOfCis += parseInt(tmp[0]);
    }

    var i;
    var gr = new GlideRecord('cmdb_ci_linux_server');
    gr.initialize();
    for (i = 0; i < numOfCis; i++) {
        //gr.initialize();
        gr.name = 'tryLx_' + i;
        gr.insert();
    }
}

function buildCons(input ) {
   var linux_Base_sys_id ;
   var gr3,name ,tmp ,level,leveCis,last ;

   var res = input.split(" ");
   var numOfCis = 0 ;
   for (i = 0; i < res.length; i++) {
       tmp =  res[i].split(",");
       numOfCis += parseInt(tmp[0]);
   }

   var gr1 = new GlideRecord("cmdb_ci_linux_server");
   gr1.addQuery("name","tryBase");
   gr1.query();
   gr1.next();
   var linux_Base_sys_id = gr1.getValue("sys_id");
   
   var gr2 = new GlideRecord("cmdb_ci_service");
   gr2.addQuery("name","NoasService");
   gr2.query();
   gr2.next();
   var service_sys_id= gr2.getValue("sys_id");

   var importer = new CreateOrUpdateITService();
   var flag =false ; 
   var sofarcis = 0
   for (J = 0; J < res.length; J++) {
        tmp  =  res[J].split(",");
        level = parseInt(tmp[1]);
        leveCis = parseInt(tmp[0]);
        for (i = 0; i < leveCis; i++) {
             if (flag) {
                 //calc father
                 gr3 = new GlideRecord("cmdb_ci_linux_server");
                 indx = (i %last) + sofarcis  - last ;
                 name = 'tryLx_' + indx;
                 gr3.addQuery("name",name);
                 gr3.query();
                 gr3.next();
                 linux_Base_sys_id = gr3.getValue("sys_id");
             } 
             gr3 = new GlideRecord("cmdb_ci_linux_server");
             indx = i + sofarcis ;
             name = 'tryLx_' + indx;
             gr3.addQuery("name",name);
             gr3.query();
             gr3.next();
             linux_sys_id = gr3.getValue("sys_id");
             importer.addCI(service_sys_id, linux_Base_sys_id , linux_sys_id);
         }
         last = leveCis ; 
         sofarcis += leveCis ;
         flag =true ; 
    }
}

function extaCons( input , addedConns  ) {
    var importer = new CreateOrUpdateITService();
    var res = input.split(" ");
    var res1 = addedConns.split(" ");
    var gr2 = new GlideRecord("cmdb_ci_service");
    gr2.addQuery("name","NoasService");
    gr2.query();
    gr2.next();
    var service_sys_id= gr2.getValue("sys_id");
    for (i = 0; i < res1.length; i++) {
        tmp =  res1[i].split(",");
        level = tmp[0] ;
        NumOfNewCons= tmp[1] ; 
        soFar =0 ;
        for (i1 = 0; i1 < (level -1) ; i1++) {
            tmp1 =  res[i1].split(",");
            soFar += parseInt(tmp1[0]);
        }
        soFar2 =0 ;
        for (i1 = 0; i1 < level  ; i1++) {
            tmp1 =  res[i1].split(",");
            soFar2 += parseInt(tmp1[0]);
        }
        tmp2 = res[level].split(",");
        ConsNumTarget = tmp2[0];
        tmp2 = res[level-1].split(",");
        Startnum= tmp2[0]

        for (i1 = 0; i1 < Startnum  ; i1++) {
             //build con
             gr3 = new GlideRecord("cmdb_ci_linux_server");
             indx = i1 + soFar   ;
             name = 'tryLx_' + indx;
             gr3.addQuery("name",name);
             gr3.query();
             gr3.next();
             linux_Base_sys_id = gr3.getValue("sys_id");
            for (i2 = 0; i2 < ConsNumTarget  ; i2++) {
                gr3 = new GlideRecord("cmdb_ci_linux_server");
                indx = i2 + soFar2 ;
                name = 'tryLx_' + indx;
                gr3.addQuery("name",name);
                gr3.query();
                gr3.next();
                linux_sys_id = gr3.getValue("sys_id");
                importer.addCI(service_sys_id, linux_Base_sys_id , linux_sys_id);
                NumOfNewCons -=1;
                if (NumOfNewCons <1) {break ;}
            }
            if (NumOfNewCons <1) {break ;}
        }
    }
}

function clean() {
    var gr = new GlideRecord('cmdb_ci_linux_server');
	gr.addQuery('name','STARTSWITH','try'); 
	gr.query();
    while(gr.next()) { gr.deleteRecord();; }   
}

function clean1() {
var gr = new GlideRecord('cmdb_ci_linux_server');
gr.addQuery('name','STARTSWITH','try'); 
gr.setWorkflow(false); //Don't fire Business rule,notifications   
gr.deleteMultiple();   
} 
