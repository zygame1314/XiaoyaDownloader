import { init } from 'https://cdn.jsdmirror.com/npm/@waline/client@v3/dist/waline.js';

init({
    el: '#waline',
    dark: 'body.night-mode',
    serverURL: 'https://xiaoyaapi.zygame1314.site',
    placeholder: '说点什么……',
    avatar: 'mp',
    meta: ['nick', 'mail'],
    pageSize: 10,
    lang: 'zh-CN',
    highlight: true,
    recordIP: true,
    emoji: [
        'https://valine-emoji.bili33.top/bilibilitv',
    ],
    imageUploader: async (file) => {
        const webpBlob = await convertToWebP(file);

        const formData = new FormData();
        formData.append('file', webpBlob, `${file.name.split('.')[0]}.webp`);

        try {
            const response = await fetch('https://xiaoya.zygame1314.site/comment/upload-image', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('上传失败');
            }

            const result = await response.json();
            return result.url;
        } catch (error) {
            console.error('上传图片失败:', error);
            alert('图片上传失败，请重试');
            return null;
        }
    },
    pageview: true,
    comment: true,
    search: false,
    locale: {
        placeholder: '说点什么……',
        sofa: '快来发表你的评论吧~',
    }
});

async function convertToWebP(file) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(blob => {
                URL.revokeObjectURL(url);
                resolve(blob);
            }, 'image/webp', 0.5);
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('图片处理失败'));
        };

        img.src = url;
    });
}