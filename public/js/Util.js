const Util = {
      generateUID: () => {
            // https://es.stackoverflow.com/questions/49976/c%C3%B3mo-generar-identificadores-%C3%BAnicos-con-javascript
            var d = new Date().getTime();
            let uuid = 'xxxxxxxx4xxxyxxxx'.replace(/[xy]/g, function (c) {
                  let r = (d + Math.random() * 16) % 16 | 0;
                  d = Math.floor(d / 16);
                  return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
      },

      // [min, max]
      generateAleatorio: (min=0, max=9) => {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min);
      },

      // Obtiene el código de 6 digitos
      generateCode: (lenCodigo = 6) => {
            let codigo = "";
            let tmp = lenCodigo;
            while (lenCodigo > 0) {
                  let numAl = Util.generateAleatorio();
                  if (lenCodigo === tmp && numAl === 0) continue
                  codigo += numAl
                  lenCodigo--
            }
            return codigo
      },

      ocultarAlert: (elAlert) => {
            window.setTimeout(function() {
                  elAlert.classList.add('hide');
                  elAlert.classList.remove('show');
            }, 10000);
      },

      hideAlert: (elAlertId) => {
            const alertEl = document.getElementById(elAlertId);
            alertEl.classList.add('hide');
            alertEl.classList.remove('show');
      },

      showAlert: (elAlertId) => {
            const alertEl = document.getElementById(elAlertId);
            alertEl.classList.add('show');
            alertEl.classList.remove('hide');
      },

      closeAlert: (elAlertId) => {
            Util.hideAlert(elAlertId)
      },

      getCodeAlert: (actionRequest) => {
            switch(actionRequest) {
                  case Constants.ACTION_OPENLOCK:
                      return Constants.CODE_ALERT_CP
                  case Constants.ACTION_OPENPORTAL:
                      return Constants.CODE_ALERT_CP
                  case Constants.ACTION_TOGGLELIGHT:
                        return Constants.CODE_ALERT_CP
                  case Constants.ACTION_NEWCODE:
                        return Constants.CODE_ALERT_CC
                  case Constants.ACTION_SETCARD:
                        return Constants.CODE_ALERT_LLM
                  case Constants.ACTION_SYNCTIME:
                        return Constants.CODE_ALERT_CP
                  default:
                      return ''
            }
      },

      showErrorValidate: (actionExec, titleSection='NA') => {
            const codeAccion = Util.getCodeAlert(actionExec)
            const msgKO = document.getElementById(`msgKO_${codeAccion}`);
            msgKO.innerHTML = `Por favor, ingresar y/o verificar todos los campos de la sección "${titleSection}" sean correctos!`;
            Util.showAlert(`alertKO_${codeAccion}`);
            Util.hideAlert(`alertOK_${codeAccion}`);
      }
}