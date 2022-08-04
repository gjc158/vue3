import service from "@/utils/server/request"

export const getArticleList = (data: object) => {
    return service({
        url: '/api/getArticleList',
        method: 'POST',
        data
    })
}