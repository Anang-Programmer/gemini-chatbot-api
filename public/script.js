const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const sendBtn = document.getElementById('send-btn');

let conversation = []; // simpan semua riwayat

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Tambah ke UI
  appendMessage('user', userMessage);

  // Tambah ke memory percakapan
  conversation.push({ role: "user", text: userMessage });

  input.value = ''; // Kosongkan input
  setLoading(true); // Mulai loading

  // Tampilkan indikator "mengetik"
  const typingIndicator = showTypingIndicator();

  try {
    // Kirim seluruh percakapan ke backend
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ conversation })
    });

    const data = await response.json();

    if (data.success) {
      const botReply = data.data;
      appendMessage('bot', botReply);

      // Simpan balasan ke memory percakapan
      conversation.push({ role: "model", text: botReply });
    } else {
      appendMessage('bot', "❌ Error: " + data.message);
    }

  } catch (err) {
    appendMessage('bot', "⚠️ Oops! Terjadi masalah di server: " + err.message);
  } finally {
    // Hapus indikator "mengetik" dan aktifkan kembali form
    chatBox.removeChild(typingIndicator);
    setLoading(false);
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);

  if (sender === 'bot') {
    // Jika pengirimnya adalah bot, format teksnya
    msg.innerHTML = formatBotMessage(text);
  } else {
    // Jika dari user, tampilkan teks biasa untuk keamanan
    msg.innerText = text;
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function formatBotMessage(text) {
  // Ubah **teks** menjadi <strong>teks</strong> (tebal)
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Ubah *teks* menjadi <em>teks</em> (miring)
  formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Ubah `teks` menjadi <code>teks</code> (kode)
  formattedText = formattedText.replace(/`(.*?)`/g, '<code>$1</code>');
  // Ubah baris baru menjadi <br>
  formattedText = formattedText.replace(/\n/g, '<br>');
  return formattedText;
}

function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.classList.add('message', 'bot');
  typingDiv.innerHTML = `
    <div class="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  return typingDiv;
}

function setLoading(isLoading) {
  input.disabled = isLoading;
  sendBtn.disabled = isLoading;
}
