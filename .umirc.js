export default {
    plugins: [
        ['umi-plugin-react', {
            dva: true,
            antd: true, // antd 默认不开启，如有使用需自行配置
            routes: {
                exclude: [/models\//, /services\//, /components\//, /utils\//, /service\.js/],
            },
        }]
    ],
}