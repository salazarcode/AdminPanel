var app = new Vue({
    el: '#app',
    data: {
        message: 'Hola Vue!',
        dominios: [],
        usuarios: [],
        FormUsuario: {
            name:"",
            email: "",
            rol_id: 1,
            password: ""
        },
        FormDominio:{
            nombre: ""
        },
        dominioDetalle: "",
        dominioVacio: {nombre:"", valores: []},
        dominioSeleccionado: {nombre:"", valores: []},
        api: "https://andresalteclado.com/api",
        token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYTZkMGJmYWI1ZWUwNjE5ZWE0YTE1OWI2MjIwYTllMzFiYjA5NzM4N2QxY2Y2NTc4NTc1NTRkZGE4MGIyZmQ3YjUzY2IwZWVkYzM1Nzk3ZWYiLCJpYXQiOjE1OTI0MzI2MjYsIm5iZiI6MTU5MjQzMjYyNiwiZXhwIjoxNjIzOTY4NjI2LCJzdWIiOiI2Iiwic2NvcGVzIjpbXX0.j31yqv5Zud49-hO4iNtgEYXKEsxM0XWYN8YiuweCYtYchFGm32WmORhJKOIz5-SgVzPx8Qn1k5ZrA4jllCSEXYukSeTBBBJ7h5q7oYaCKsmkp78QXKKbmze-o_VozL_DeQUK-a9YicPLj1zdjXk5ShuuUY9H4TwTmHULcMMrO2ea35_XicNIhct7omfStC5vuTZ_PpAIZTX3P52SajNnjlB9oNlLz-jvCii0DRlwwpBAMUZgUtXbs6xYSDRhVR5JAh8Zmcb5PCMCRX0x0Ff7QvbTfPqrPMuRfKKAZg2U1ZjYrpbaeej6xbKSoVqQBVYtfidhIvEzzEhKSyLKxMeq-mqFQK6x4X_At02Y6ly6guNMsMwMoswYVFRUTDvF9H5YfbqXJvGZBiN67wtZlL-RnI9U2qSwZZgqjWA_apHq5cyuJ814btgz-LePtD2KwS15eOR0sSY4ODwxPayfGRdeo5UOOoby4QWYf_JNz38ugBCbNs5atZhhIprhAj861J4VJ_00O3sFzP2e7G5C7PT86N8oWwhJRtrMCQlRtMQ12NFb8WFid7X4-kHorcM8PQAs7qD8ENOCxphJDG29hywC91LvyEV0OqmQa_BBfSY5KtGXX9RF_Mp8-scOzvBTfa8IiPejJLf-If7dRqREBg-MBh680KZDgejkLCy3A5VFy6g"
    },
    methods: {
        getSimple: async function(ruta){
            var res = await fetch(this.api + ruta, { headers: { "Authorization": "Bearer " + this.token }}).then(x=>x.json());
            return res;
        },
        MostrarFormUsuario: function(){
            $("#crear-usuario").toggleClass("is-active");
        },
        MostrarFormDominio: function(){
            $("#crear-dominio").toggleClass("is-active");
        },
        MostrarDetalleDomino: function(dominio){
            this.dominioSeleccionado = dominio;
            $("#detalle-dominio").toggleClass("is-active");
        },
        GuardarUsuario: async function(event){
            $(event.target).toggleClass("is-loading");
            var formData = new FormData();
            formData.append("rol_id", app.FormUsuario.rol_id);
            formData.append("email", app.FormUsuario.email);
            formData.append("password", app.FormUsuario.password);
            formData.append("name", app.FormUsuario.name);

            let res = await fetch(this.api + "/usuarios", {
                method: "POST",
                body: formData,
                headers: new Headers({
                    "Authorization": "Bearer " + this.token,
                    "X-Requested-With": "XMLHttpRequest"
                })
            }).then(x=>x.json());
            
            this.usuarios = await this.getSimple("/usuarios");   
            $(event.target).toggleClass("is-loading");
            this.MostrarFormUsuario();
        },
        GuardarDominio: async function(event){
            $(event.target).toggleClass("is-loading");
            var formData = new FormData();
            formData.append("nombre", app.FormDominio.nombre);

            let res = await fetch(this.api + "/dominios", {
                method: "POST",
                body: formData,
                headers: new Headers({
                    "Authorization": "Bearer " + this.token,
                    "X-Requested-With": "XMLHttpRequest"
                })
            }).then(x=>x.json());
            this.FormDominio.nombre = "";
            this.dominios = await this.getSimple("/dominios");   
            $(event.target).toggleClass("is-loading");
            this.MostrarFormDominio();
        },
        GuardarDominioDetalle: async function(event,id){
            $(event.target).toggleClass("is-loading");

            var formData = new FormData();
            formData.append("nombre", this.dominioDetalle);

            let res = await fetch(this.api + "/dominios/"+id+"/add", {
                method: "POST",
                body: formData,
                headers: new Headers({
                    "Authorization": "Bearer " + this.token,
                    "X-Requested-With": "XMLHttpRequest"
                })
            }).then(x=>x.json());

            this.dominios = await this.getSimple("/dominios");
            $(event.target).toggleClass("is-loading");
            this.dominioSeleccionado = this.dominios.find(x=>x.id==id);
        }

    },
    computed: {
        roles: function(){
            if(this.dominios.length != 0)
                return this.dominios.filter(x=>x.id == 1)[0].valores;
            else
                return [];
        }
    },
    async mounted(){        
        this.dominios = await this.getSimple("/dominios");
        this.usuarios = await this.getSimple("/usuarios");   
    }
})