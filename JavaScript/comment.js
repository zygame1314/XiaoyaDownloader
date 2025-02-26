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
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('https://zygame1314.site/comment/upload-image', {
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