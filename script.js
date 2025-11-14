// Arquivo JavaScript para funcionalidades do catálogo.

document.addEventListener('DOMContentLoaded', () => {
    console.log('Catálogo carregado. Adicionando funcionalidade de compra via WhatsApp e Modal de Detalhes.');

    const whatsappNumber = '5588993567435'; // Número de WhatsApp sem sinais ou espaços

    // --- Funcionalidade de Compra via WhatsApp ---
    const buyButtons = document.querySelectorAll('.buy-button');

    buyButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Previne que o clique no botão dentro do modal feche o modal
            event.stopPropagation(); 
            
            const productName = event.target.getAttribute('data-product-name');
            const productPrice = event.target.getAttribute('data-product-price');

            // Mensagem pré-preenchida
            const message = `Olá! Tenho interesse em comprar o produto: ${productName} (Preço: ${productPrice}). Gostaria de fazer o meu pedido.`;

            // Codificar a mensagem para URL
            const encodedMessage = encodeURIComponent(message);

            // Construir o link do WhatsApp
            const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;

            // Abrir o link em uma nova aba
            window.open(whatsappLink, '_blank');
        });
    });

    // --- Funcionalidade do Modal de Detalhes ---
    const modal = document.getElementById('product-modal');
    const closeButton = document.querySelector('.close-button');
    const productTriggers = document.querySelectorAll('.product-card, .product-name');

    // Elementos do Modal
    const modalImage = document.getElementById('modal-product-image');
    const modalName = document.getElementById('modal-product-name');
    const modalOldPrice = document.getElementById('modal-old-price');
    const modalDiscount = document.getElementById('modal-discount');
    const modalCurrentPrice = document.getElementById('modal-current-price');
    const modalInstallment = document.getElementById('modal-installment');
    const modalBuyButton = document.getElementById('modal-buy-button');
    const modalThumbnailGallery = document.getElementById('modal-thumbnail-gallery');
    const modalDescription = document.getElementById('modal-description');

    // Função para abrir o modal
    const openModal = (productElement) => {
        // Encontrar o card pai para extrair todos os dados
        const card = productElement.closest('.product-card');
        
        // Limpar miniaturas anteriores
        modalThumbnailGallery.innerHTML = '';
        
        // Extrair dados
        const name = card.querySelector('.product-name').textContent;
        const currentPrice = card.querySelector('.current-price').textContent.replace('à vista', '').trim();
        const imageElement = card.querySelector('img');
        const oldPrice = imageElement.getAttribute('data-old-price');
        const discount = imageElement.getAttribute('data-discount');
        const installment = imageElement.getAttribute('data-installment');
        const imageSrc = imageElement.getAttribute('src');
        const longDescription = card.getAttribute('data-long-description');
        const extraImagesAttr = card.getAttribute('data-extra-images');
        const extraImages = extraImagesAttr ? extraImagesAttr.split(',') : [];

        // Preencher o Modal
        modalImage.src = imageSrc;
        modalName.textContent = name;
        modalOldPrice.textContent = oldPrice;
        modalDiscount.textContent = discount;
        modalCurrentPrice.textContent = currentPrice;
        modalInstallment.textContent = installment;
        modalDescription.textContent = longDescription;

        // Criar e preencher a galeria de miniaturas
        const allImages = [imageSrc, ...extraImages];
        allImages.forEach(imgSrc => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = `Miniatura de ${name}`;
            img.classList.add('thumbnail');
            if (imgSrc === imageSrc) {
                img.classList.add('active');
            }
            img.addEventListener('click', () => {
                modalImage.src = imgSrc;
                modalThumbnailGallery.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
                img.classList.add('active');
            });
            modalThumbnailGallery.appendChild(img);
        });

        // Atualizar o botão de compra do modal
        modalBuyButton.setAttribute('data-product-name', name);
        modalBuyButton.setAttribute('data-product-price', currentPrice);

        // Exibir o modal
        modal.style.display = 'block';
    };

    // Adicionar evento de clique aos triggers
    productTriggers.forEach(trigger => {
        trigger.addEventListener('click', (event) => {
            // Evita que o clique no botão de compra abra o modal
            if (event.target.classList.contains('buy-button')) {
                return;
            }
            openModal(event.currentTarget);
        });
    });

    // Função para fechar o modal
    const closeModal = () => {
        modal.style.display = 'none';
    };

    // Fechar ao clicar no X
    closeButton.addEventListener('click', closeModal);

    // Fechar ao clicar fora do modal
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
});
