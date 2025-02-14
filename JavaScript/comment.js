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
    imageUploader: false,
    pageview: true,
    comment: true,
    search: false,
    locale: {
        placeholder: '说点什么……',
        sofa: '快来发表你的评论吧~',
    }
});