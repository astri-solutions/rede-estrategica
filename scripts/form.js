/**
 * Formulário Contato — validação visual básica
 *
 * Quando integrado ao Workr/ASPX:
 * - Trocar <form> por <form runat="server" id="formContato">
 * - Trocar <input> por <asp:TextBox ID="txtNome" runat="server">
 * - Adicionar handler do botão <asp:Button OnClick="btnEnviar_Click">
 * - Configurar <asp:Recaptcha> no lugar do placeholder
 */
(function () {
  'use strict';

  var form = document.getElementById('formContato');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Placeholder — substituir pela integração com endpoint Workr
    alert('Mensagem pronta para envio. Endpoint Workr será integrado na próxima etapa.');
  });
})();
