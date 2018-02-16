const soap = require('soap')
var Rut = require('rutjs')


function RCivilInfoGeneral(builder) {
    //this.builder = builder

    this.dialogId = 'RegistroCivilInfoGeneral'

    this.dialog = [(session, args, next) => {

        //regex para detectar rut entre texto
        const regex = /(0?[1-9]{1,2})(((\.\d{3}){2,}\-)|((\d{3}){2,}\-)|((\d{3}){2,}))([\dkK])/g;
        //obtiene los grupos reconocidos según el regex
        var groups = (new RegExp(regex)).exec(session.message.text)
        //en caso de obtener los grupos validos del regex en el texto se genera como rut para validar, en caso contrario no se encuentra rut.
        var RutValido = groups ? new Rut(groups[0]).validate() : false;

        session.send('Ha empezado una consulta de datos en el servicio de Registro Civil');

        if ((!groups && !RutValido) || !groups) {
            builder.Prompts.ValidarRut(session, "¿Cuál es el rut que quiere consultar?");
        } else {
            next({ response: groups[0] });
        }
    },
    (session, results) => {
        if (results === 'cancel')
            session.endDialog('Ha cancelado la consulta de datos en el Registro Civil');

        var rut = new Rut(results.response);
        var digitos = rut.rut;
        var verificador = rut.checkDigit;

        var args = { entradaRCivil: { Rut: digitos, Dv: verificador, Periodo: '-1', UsSist: '1' } };

        session.send('Ha consultado los datos en Registro Civil del rut: ' + rut.getCleanRut());

        soap.createClient('http://wsminvune.minvu.cl/Minvu.RegistroCivil/REGCIVIL_orc_datos_persona_prt_regcivil_info_persona.asmx?singleWsdl', function (err, client) {
            if (err) {
                session.send('Con respecto a su consulta de datos en Registro Civil, lo lamento, tuve un error al consultar el servicio de Registro Civil');
                console.log(err)
            }
            else {
                client['ope_prt_regcivil_info_persona' + 'Async'](args).then((result) => {
                    if (!result.ope_prt_regcivil_info_persona.RESULTADO ||
                        !result.ope_prt_regcivil_info_persona.minvuRutData ||
                        !result.ope_prt_regcivil_info_persona.minvuRutData.persona) {
                        session.send('Con respecto a su consulta de datos en Registro Civil, lo lamento, no pude obtener datos del servicio de Registro Civil')
                    }
                    else {
                        if (result.ope_prt_regcivil_info_persona.RESULTADO.Estado === 1)
                            session.send('Con respecto a su consulta de datos en Registro Civil, la información del rut ' + rut.getNiceRut() + ' es ' + infoRegistroCivil);
                        else if (result.ope_prt_regcivil_info_persona.RESULTADO.Estado === 0)
                            session.send('Con respecto a su consulta de datos en Registro Civil, no encuentro resultados para el rut ' + rut.getNiceRut() + '.');
                        else
                            session.send('Con respecto a su consulta de datos en Registro Civil, no reconozco la información que me entregan');
                    }
                }).catch((err) => {
                    console.log(err)
                    session.send('Con respecto a su consulta de datos en Registro Civil, lo lamento, tuve un error al consultar el servicio de Registro Civil');
                });
            }
        })
        session.endDialog()
    }]

}
exports.RCivilInfoGeneral = RCivilInfoGeneral;