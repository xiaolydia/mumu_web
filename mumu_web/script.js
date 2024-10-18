document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");
    console.log("jwt_encode function available:", typeof jwt_encode !== 'undefined');

    // 导航栏折叠功能
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navbarToggler.addEventListener('click', function() {
        navbarCollapse.classList.toggle('show');
    });

    // 返回顶部按钮
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({top: 0, behavior: 'smooth'});
    });

    // AI助手悬浮窗功能
    const aiAssistant = document.getElementById('ai-assistant');
    const aiAssistantToggle = document.getElementById('ai-assistant-toggle');
    const aiAssistantHeader = document.getElementById('ai-assistant-header');

    aiAssistantHeader.addEventListener('click', function() {
        aiAssistant.classList.toggle('ai-assistant-closed');
        const icon = aiAssistantToggle.querySelector('i');
        icon.classList.toggle('fa-chevron-up');
        icon.classList.toggle('fa-chevron-down');
    });

    // AI对话功能
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatHistory = document.getElementById('chat-history');

    if (!chatForm || !chatInput || !chatHistory) {
        console.error("One or more chat elements not found");
        return;
    }

    // OpenAI API Key
    const OPENAI_API_KEY = 'sk-eJprHZECx7IxzLRk8c594624212c4801Ad6005A0EaA7F7F5';

    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log("Chat form submitted");
        const userMessage = chatInput.value.trim();
        if (userMessage) {
            addMessageToChat('user', userMessage);
            chatInput.value = '';

            try {
                const response = await fetch('https://chatapi.midjourney-vip.cn/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${OPENAI_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: "gpt-3.5-turbo",
                        messages: [{"role": "user", "content": userMessage}],
                        temperature: 0.7
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`HTTP error! status: ${response.status}, message:`, errorText);
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }

                const data = await response.json();
                console.log("AI response received:", data);
                const aiReply = data.choices[0].message.content;
                addMessageToChat('ai', aiReply);
            } catch (error) {
                console.error('Error:', error);
                addMessageToChat('ai', "抱歉，我遇到了一些问题。请稍后再试。错误详情：" + error.message);
            }
        }
    });

    function addMessageToChat(sender, message) {
        console.log(`Adding ${sender} message to chat`);
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = message;
        chatHistory.appendChild(messageElement);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        
        // 如果AI助手窗口是关闭的，自动打开它
        if (aiAssistant.classList.contains('ai-assistant-closed')) {
            aiAssistant.classList.remove('ai-assistant-closed');
            const icon = aiAssistantToggle.querySelector('i');
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
    }

    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 联系表单处理
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // 这里您可以添加发送邮件的逻辑，或者将数据发送到后端服务器
            console.log('联系表单提交:', { name, email, message });
            
            // 显示提交成功消息
            alert('感谢您的留言！我会尽快回复您。');
            
            // 清空表单
            contactForm.reset();
        });
    }
});
