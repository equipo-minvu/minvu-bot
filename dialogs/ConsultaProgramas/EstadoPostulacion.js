const axios = require('axios')
var Rut = require('rutjs')
const helper = require('../../extensions/helper');
const util = require('util')


function EstadoPostulacion(builder) {
    this.dialogId = 'EstadoPostulacion'

    this.dialog = [(session, args, next) => {

        //regex para detectar rut entre texto
        const regex = /(0?[1-9]{1,2})(((\.\d{3}){2,}\-)|((\d{3}){2,}\-)|((\d{3}){2,}))([\dkK])/g;
        //obtiene los grupos reconocidos según el regex
        var groups = (new RegExp(regex)).exec(session.message.text)
        //en caso de obtener los grupos validos del regex en el texto se genera como rut para validar, en caso contrario no se encuentra rut.
        var RutValido = groups ? new Rut(groups[0]).validate() : false;

        session.send('¡Muy bien! Vamos a realizar una consulta para verificar estados de postulacion 😁');

        if ((!groups && !RutValido) || !groups) {
            builder.Prompts.ValidarRut(session, "🤔... ¿Cuál rut vamos a consultar? 😈");
        } else {
            next({ response: groups[0] });
        }
    },
    (session, results) => {
        if (results === 'cancel')
        {
            session.endDialog('Has cancelado la consulta del estado de postulación 😭. ¡Vuelve Pronto!');            
            session.beginDialog('MenuAyuda','MenuFinal'); 
        }

        var rut = new Rut(results.response);
        var digitos = rut.rut;
        var verificador = rut.checkDigit;

<<<<<<< HEAD:dialogs/ConsultaProgramas/EstadoPostulacion.js
        const url = process.env.DINBOT_API + `/EstadoPostulacion/EstadoPostulacion/${digitos}`;
        axios.get(url)
            .then(function (response) {
                if (response.status == 200) {
                    if(response.data.length > 0){
                        //si encuentra resultado crea las tarjetas, en caso de no encontrar resultado entrega mensaje que no encuentra registros            
                        var cards = new Array();
                        //Manda las postulaciones encontradas para crearlos en tarjetas
                        for (var i = 0; i < response.data.length; i++) {
                            var item = response.data[i]
                            //lo agrega a un array de tarjetas
                            cards.push(createHeroCard(session, rut.getNiceRut(), item))
                        }

                        //crea un carousel con las tarjetas antes creadas
                        var reply = new builder.Message(session)
                            .attachmentLayout(builder.AttachmentLayout.carousel)
                            .attachments(cards)

                        session.send(`Con respecto a la consulta del estado de postulación del rut: ${rut.getNiceRut()} le puedo dar la siguiente información:`)
                        session.send(reply)
                        session.beginDialog('MenuAyuda','MenuFinal'); 
                    }
                    else{
                        session.send(`Con respecto a su consulta del estado de postulación del rut: ${rut.getNiceRut()} No se encontró información.`)
                        session.beginDialog('MenuAyuda','MenuFinal');
                    }
=======
        new sql.ConnectionPool(process.env.DBRukanMigra)
        .connect().then(pool => {
            // Query
            //Obtiene el PA de consumo de Rukan
            return pool.request()
                .input('RUT', sql.VarChar, digitos)
                .execute('RUKAN_MIGRA_USP_CON_DINBOT_ESTADO_POSTULACION_DS49')
        }).then(result => {
            //si encuentra resultado crea las tarjetas, en caso de no encontrar resultado entrega mensaje que no encuentra registros
            //console.log(result.recordsets)
            if (result.recordsets[0].length > 0) {
                var cards = new Array();
                //Manda las postulaciones encontradas para crearlos en tarjetas
                for (var i = 0; i < result.recordsets[0].length; i++) {
                    item = result.recordsets[0][i]
                    //lo agrega a un array de tarjetas
                    cards.push(createHeroCard(session, rut.getNiceRut(), item))
>>>>>>> 00554fe5853a7ae20ace7b92db2ebc3ddfc2daf2:dialogs/DS49/EstadoPostulacion.js
                }
                else
                {
                    session.send(`Con respecto a su consulta del estado de postulación del rut: ${rut.getNiceRut()} No se encontraron registros.`)
                    session.beginDialog('MenuAyuda','MenuFinal');
                }            
            })
            .catch(function (error) {
                    session.send('Lo siento, hubo un error al consultar el estado de postulación del rut: ' + rut.getNiceRut())
                    console.log('error')
                    console.dir(error)   
                    session.beginDialog('MenuAyuda','MenuFinal'); 
            });
    session.endDialog()
}]

function createHeroCard(session, rutCompleto, objPersona) {
    var detallePostulacion;
    var noAplica = 'N/A';    
    var nombrePersona = objPersona.NombrePersona;

    detallePostulacion = `**TIPO DE POSTULACIÓN**: ${(util.isNullOrUndefined(objPersona.TipoPostulacion) ? `Sin Registro` : objPersona.TipoPostulacion)}`
        + `\n\n**ESTADO RUKÁN**: ${(util.isNullOrUndefined(objPersona.EstadoRukan) ? `Sin Registro` : objPersona.EstadoRukan)}`
        + `\n\n**ESTADO POSTULACIÓN**: ${(util.isNullOrUndefined(objPersona.EstadoPostulacion) ? `Sin Registro` : objPersona.EstadoPostulacion)}`
        + `\n\n**FECHA POSTULACIÓN**: ${(util.isNullOrUndefined(objPersona.FechaPostulacion) ? `Sin Registro` : objPersona.FechaPostulacion)}`

    if(objPersona.CertificadoSubsidio != noAplica)
    {
        detallePostulacion += `\n\n**ESTADO SUBSIDIO**: ${(util.isNullOrUndefined(objPersona.EstadoSubsidio) ? `Sin Registro` : objPersona.EstadoSubsidio)}`
        + `\n\n**SERIE CERTIFICADO**: ${(util.isNullOrUndefined(objPersona.CertificadoSubsidio) ? `Sin Registro` : objPersona.CertificadoSubsidio)}`
    }

    switch(objPersona.TipoPostulacion)
    {
        case 'Asignación Directa':
        {
            detallePostulacion += `\n\n**N° SOLICITUD AD**: ${(util.isNullOrUndefined(objPersona.SolicitudAD) ? `Sin Registro` : objPersona.SolicitudAD)}`
        + `\n\n**ESTADO AD**: ${(util.isNullOrUndefined(objPersona.EstadoAD) ? `Sin Registro` : objPersona.EstadoAD)}`
            break;
        }
        case 'Banco de Grupos':
        {
            detallePostulacion += `\n\n**CÓDIGO DE GRUPO**: ${(util.isNullOrUndefined(objPersona.CodigoGrupo) ? `Sin Registro` : objPersona.CodigoGrupo)}`
        + `\n\n**TIPO DE GRUPO**: ${(util.isNullOrUndefined(objPersona.TipoGrupo) ? `Sin Registro` : objPersona.TipoGrupo)}`
        + `\n\n**ESTADO GRUPO**: ${(util.isNullOrUndefined(objPersona.EstadoDeGrupo) ? `Sin Registro` : objPersona.EstadoDeGrupo)}`
        + `\n\n**ESTADO PERSONA EN GRUPO**: ${(util.isNullOrUndefined(objPersona.EstadoPersonaGrupo) ? `Sin Registro` : objPersona.EstadoPersonaGrupo)}`
            if(objPersona.AsociaProyecto == 'Sí')
            {
                detallePostulacion += `\n\n**ASOCIA PROYECTO**: ${(util.isNullOrUndefined(objPersona.AsociaProyecto) ? `Sin Registro` : objPersona.AsociaProyecto)}`
                    + `\n\n**CÓDIGO DE PROYECTO**: ${(util.isNullOrUndefined(objPersona.CodigoProyecto) ? `Sin Registro` : objPersona.CodigoProyecto)}`
                    + `\n\n**TIPO DE PROYECTO**: ${(util.isNullOrUndefined(objPersona.TipoProyecto) ? `Sin Registro` : objPersona.TipoProyecto)}`
                    + `\n\n**ESTADO PROYECTO**: ${(util.isNullOrUndefined(objPersona.EstadoProyecto) ? `Sin Registro` : objPersona.EstadoProyecto)}`
                    + `\n\n**ESTADO PERSONA EN PROYECTO**: ${(util.isNullOrUndefined(objPersona.EstadoPersonaProyecto) ? `Sin Registro` : objPersona.EstadoPersonaProyecto)}`     
                    + `\n\n**ESTADO ADSCRIPCIÓN**: ${(util.isNullOrUndefined(objPersona.EstadoAdscripcion) ? `Sin Registro` : objPersona.EstadoAdscripcion)}`              
            }
            break;
        }
        case 'Banco de Postulaciones':
        {
            detallePostulacion += `\n\n**CÓDIGO DE PROYECTO**: ${(util.isNullOrUndefined(objPersona.CodigoProyecto) ? `Sin Registro` : objPersona.CodigoProyecto)}`
                + `\n\n**TIPO DE PROYECTO**: ${(util.isNullOrUndefined(objPersona.TipoProyecto) ? `Sin Registro` : objPersona.TipoProyecto)}`
                + `\n\n**ESTADO PROYECTO**: ${(util.isNullOrUndefined(objPersona.EstadoProyecto) ? `Sin Registro` : objPersona.EstadoProyecto)}`
                + `\n\n**ESTADO PERSONA EN PROYECTO**: ${(util.isNullOrUndefined(objPersona.EstadoPersonaProyecto) ? `Sin Registro` : objPersona.EstadoPersonaProyecto)}`
                + `\n\n**ESTADO ADSCRIPCIÓN**: ${(util.isNullOrUndefined(objPersona.EstadoAdscripcion) ? `Sin Registro` : objPersona.EstadoAdscripcion)}`   

            if(objPersona.MigradoBcoGrupo == 'Sí')
            {
                detallePostulacion += `\n\n**MIGRADO BCO. GRUPOS**: ${(util.isNullOrUndefined(objPersona.MigradoBcoGrupo) ? `Sin Registro` : objPersona.MigradoBcoGrupo)}`
                    + `\n\n**CÓDIGO DE GRUPO**: ${(util.isNullOrUndefined(objPersona.CodigoGrupo) ? `Sin Registro` : objPersona.CodigoGrupo)}`
                    + `\n\n**TIPO DE GRUPO**: ${(util.isNullOrUndefined(objPersona.TipoGrupo) ? `Sin Registro` : objPersona.TipoGrupo)}`
                    + `\n\n**ESTADO GRUPO**: ${(util.isNullOrUndefined(objPersona.EstadoDeGrupo) ? `Sin Registro` : objPersona.EstadoDeGrupo)}`
                    + `\n\n**ESTADO PERSONA EN GRUPO**: ${(util.isNullOrUndefined(objPersona.EstadoPersonaGrupo) ? `Sin Registro` : objPersona.EstadoPersonaGrupo)}`                
            }
            break;
        }
    }

    return new builder.HeroCard(session)
        .title('Estado de Postulación')
        .subtitle(rutCompleto + ' ' + nombrePersona)        
        .text(detallePostulacion)
        .images([
            builder.CardImage.create(session, 'http://cdn.minvu.cl/NGM5.0/images/line-head-title.jpg')
        ])
}

function onWaitGif(session) {
        var msg = new builder.Message(session).addAttachment(createAnimationCard(session));
        session.send(msg);
    }

    function createAnimationCard(session) {
        return new builder.AnimationCard(session)
            .title('Dinbot Trabajando 😁')
            .subtitle('Estoy buscando los datos que necesita, ¿Me esperarías un ratito? 😇')
            .text('Puedes realizar otras consultas mientras esperas, te enviaré la información cuando la encuentre 🤓')
            /*
            .media([{
                profile: 'gif',
                url: 'https://media3.giphy.com/media/l0MYudxO2MHJDTbVK/giphy.gif'                
            }])
            */
    }    
}
exports.EstadoPostulacion = EstadoPostulacion;