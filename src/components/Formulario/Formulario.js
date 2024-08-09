import { useForm } from 'react-hook-form';
import './Formulario.css';

function App() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('https://placement-test-us-back-end.onrender.com/api/teste-nivelamento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const json = await response.json();

        if (json.html) {
          const iframeHtml = json.html;
          const nomeCompleto = data.nomeCompleto;
          const email = data.email;

          // Abre uma nova janela com a URL desejada
          const newWindow = window.open('https://placement-test-us-front-end.vercel.app/results');
          
          newWindow.document.write(`
            <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f5f5f5;
                  color: #333;
                  padding: 20px;
                }
                .logo {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 20px;
                }
                .iframe-container {
                  margin-top: 20px;
                }
                .fetch-button {
                  background-color: #0099FF;
                  color: #fff;
                  padding: 10px 20px;
                  border: none;
                  border-radius: 5px;
                  cursor: pointer;
                  margin-top: 20px;
                }
                .fetch-button:hover {
                  background-color: #007ACC;
                }
                .modal {
                  display: none;
                  position: fixed;
                  z-index: 1;
                  left: 0;
                  top: 0;
                  width: 100%;
                  height: 100%;
                  overflow: auto;
                  background-color: rgba(0,0,0,0.4);
                  justify-content: center;
                  align-items: center;
                }
                .modal-content {
                  background-color: #fff;
                  margin: 15% auto;
                  padding: 20px;
                  border: 1px solid #888;
                  border-radius: 10px;
                  width: 80%;
                  max-width: 500px;
                }
                .close-button {
                  color: #aaa;
                  float: right;
                  font-size: 28px;
                  font-weight: bold;
                  cursor: pointer;
                }
                .close-button:hover,
                .close-button:focus {
                  color: black;
                  text-decoration: none;
                  cursor: pointer;
                }
                .share-button {
                  background-color: #4CAF50;
                  color: white;
                  padding: 10px 20px;
                  margin: 5px;
                  border: none;
                  border-radius: 5px;
                  cursor: pointer;
                }
                .share-button:hover {
                  background-color: #45a049;
                }
              </style>
              <!-- Metatags Open Graph para compartilhamento no LinkedIn -->
              <meta property="og:title" content="Veja meus resultados no teste de nivelamento" />
              <meta property="og:description" content="Compartilhe seu resultado do teste de nivelamento!" />
              <meta property="og:url" content="${window.location.href}" /> <!-- Defina a URL correta aqui -->
              <meta property="og:type" content="website" />
              <meta property="og:image" content="https://cdn.wizard.com.br/wp-content/uploads/2020/10/12201330/teste-de-ingles-wizard.png" />
            </head>
            <body>
              <div class="logo">
                <img src="https://alumni.org.br/wp-content/uploads/2024/05/alumni_white.svg" alt="Alumni Logo" />
                <img src="https://alumni.org.br/wp-content/uploads/2024/05/logoConsulado.png" alt="Consulado Logo" />
              </div>
              <p>Realização do teste de nivelamento: ${nomeCompleto}</p>
              <div class="iframe-container">
                ${iframeHtml}
              </div>
              <button class="fetch-button" onclick="fetchCsvData('${email}')">Compartilhar resultados do meu teste</button>
          
              <!-- Modal para exibir os resultados -->
              <div id="resultsModal" class="modal">
                <div class="modal-content">
                  <span class="close-button" onclick="closeModal()">&times;</span>
                  <h2>Resultados do Teste</h2>
                  <p id="fluency_score"></p>
                  <p id="pronunciation_score"></p>
                  <p id="quiz_cefr"></p>
                  <p id="quiz_score"></p>
                  <p id="vocab_score"></p>
          
                  <!-- Botões de Compartilhamento -->
                  <div style="margin-top: 20px;">
                    <button class="share-button" onclick="shareLinkedIn()">Compartilhar no LinkedIn</button>
                    <button class="share-button" onclick="shareFacebook()">Compartilhar no Facebook</button>
                  </div>
                </div>
              </div>
          
              <script>
                function fetchCsvData(userEmail) {
                  fetch('https://placement-test-us-back-end.onrender.com/api/baixar-csv')
                    .then(response => response.json())
                    .then(data => {
                      const user = data.find(record => record.email === userEmail);
          
                      if (user) {
                        document.getElementById('fluency_score').textContent = 'Fluency Score: ' + user.fluency_score;
                        document.getElementById('pronunciation_score').textContent = 'Pronunciation Score: ' + user.pronunciation_score;
                        document.getElementById('quiz_cefr').textContent = 'Quiz CEFR: ' + user.quiz_cefr;
                        document.getElementById('quiz_score').textContent = 'Quiz Score: ' + user.quiz_score;
                        document.getElementById('vocab_score').textContent = 'Vocab Score: ' + user.vocab_score;
          
                        document.getElementById('resultsModal').style.display = 'flex';
                      } else {
                        alert('Por favor, faça o teste para receber o seu nível de inglês.');
                      }
                    })
                    .catch(error => {
                      console.error('Erro ao buscar os dados CSV', error);
                      alert('Erro ao buscar os dados CSV.');
                    });
                }
          
                function closeModal() {
                  document.getElementById('resultsModal').style.display = 'none';
                }
          
                // Função para compartilhar no LinkedIn
                function shareLinkedIn() {
                  const linkedinUrl = \`https://www.linkedin.com/sharing/share-offsite/?url=\${encodeURIComponent(window.location.href)}&title=Veja meus resultados no teste de nivelamento&summary=Confira meu desempenho no teste de nivelamento realizado por ${nomeCompleto}\`;
                  window.open(linkedinUrl, '_blank');
                }
          
                // Função para compartilhar no Facebook
                function shareFacebook() {
                  const facebookUrl = \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(window.location.href)}\`;
                  window.open(facebookUrl, '_blank');
                }
              </script>
            </body>
            </html>
          `);
          newWindow.document.close();
          console.log('Documento criado');
          
        } else {
          console.error('O JSON retornado não contém a propriedade "html"');
        }
      } else {
        console.error('Erro ao enviar os dados');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    
    <div className="form-container">
      <div class="logo">
        <img src="https://alumni.org.br/wp-content/uploads/2024/05/alumni_white.svg" alt="Alumni Logo" />
        <img src="https://alumni.org.br/wp-content/uploads/2024/05/logoConsulado.png" alt="Consulado Logo" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <input
            id="nomeCompleto"
            placeholder='Nome completo'
            type="text"
            {...register('nomeCompleto', { required: 'Nome completo é obrigatório' })}
          />
          {errors.nomeCompleto && <p className="error">{errors.nomeCompleto.message}</p>}
        </div>

        <div className="form-group">
          <input
            id="email"
            type="email"
            placeholder='Email'
            {...register('email', {
              required: 'Email é obrigatório',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email inválido',
              },
            })}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <input
            id="telefone"
            placeholder='Telefone whatsapp'
            type="text"
            {...register('telefone', {
              required: 'Telefone é obrigatório',
              minLength: {
                value: 11,
                message: 'O telefone deve ter 11 dígitos',
              },
              pattern: {
                value: /^\d+$/,
                message: 'O telefone deve conter apenas números',
              },
            })}
          />
          {errors.telefone && <p className="error">{errors.telefone.message}</p>}
        </div>

        <button type="submit" className="submit-button">Enviar</button>
      </form>
    </div>
  );
}

export default App;
