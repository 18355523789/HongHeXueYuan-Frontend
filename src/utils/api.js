import request from '../utils/request'

export function getAuthUser() {
    return request({
        url: '/oauth/user',
        method: 'get'
    })
}

export function registerUser(data) {
    return request({
        url: '/oauth/user',
        method: 'post',
        data
    })
}

export function getUsers(params) {
    return request({
        url: '/users',
        method: 'get',
        params
    })
}

export function getUser(pathVariable, params) {
    return request({
        url: '/users/' + pathVariable,
        method: 'get',
        params
    })
}

export function createUser(data) {
    return request({
        url: '/users',
        method: 'post',
        data
    })
}

export function updateUser(data) {
    return request({
        url: '/users',
        method: 'put',
        data
    })
}

export function deleteUser(pathVariable) {
    return request({
        url: '/users/' + pathVariable,
        method: 'delete'
    })
}

export function getRoles(params) {
    return request({
        url: '/roles',
        method: 'get',
        params
    })
}

export function getRole(pathVariable, params) {
    return request({
        url: '/roles/' + pathVariable,
        method: 'get',
        params
    })
}

export function createRole(data) {
    return request({
        url: '/roles',
        method: 'post',
        data
    })
}

export function updateRole(data) {
    return request({
        url: '/roles',
        method: 'put',
        data
    })
}

export function deleteRole(pathVariable) {
    return request({
        url: '/roles/' + pathVariable,
        method: 'delete'
    })
}

export function getCategories(params) {
    return request({
        url: '/categories',
        method: 'get',
        params
    })
}

export function createCategory(data) {
    return request({
        url: '/categories',
        method: 'post',
        data
    })
}

export function updateCategory(data) {
    return request({
        url: '/categories',
        method: 'put',
        data
    })
}

export function deleteCategory(pathVariable) {
    return request({
        url: '/categories/' + pathVariable,
        method: 'delete'
    })
}

export function getCourses(params) {
    return request({
        url: '/courses',
        method: 'get',
        params
    })
}

export function getAllCourses(params) {
    return request({
        url: '/courses',
        method: 'get',
        params: { ...params, pageSize: 1000 } // 獲取所有課程
    })
}

export function getCourse(pathVariable, params) {
    return request({
        url: '/courses/' + pathVariable,
        method: 'get',
        params
    })
}

export function createCourse(data) {
    return request({
        url: '/courses',
        method: 'post',
        data
    })
}

export function updateCourse(data) {
    return request({
        url: '/courses',
        method: 'put',
        data
    })
}

export function updateRegistrationOfCourse(params) {
    return request({
        url: '/courses/registration',
        method: 'put',
        params
    })
}

export function deleteCourse(pathVariable) {
    return request({
        url: '/courses/' + pathVariable,
        method: 'delete'
    })
}

export function searchCourse(params) {
    return request({
        url: '/courses/search',
        method: 'get',
        params
    })
}

export function getChaptersOfCourse(pathVariable, params) {
    return request({
        url: '/courses/' + pathVariable + '/chapters',
        method: 'get',
        params
    })
}

export function getCategoriesOfCourse(pathVariable, params) {
    return request({
        url: '/courses/' + pathVariable + '/categories',
        method: 'get',
        params
    })
}

export function getQuestionsOfCourse(pathVariable, params) {
    return request({
        url: '/courses/' + pathVariable + '/questions',
        method: 'get',
        params
    })
}

export function getNotesOfCourse(pathVariable, params) {
    return request({
        url: '/courses/' + pathVariable + '/notes',
        method: 'get',
        params
    })
}

export function getEvaluationsOfCourse(pathVariable, params) {
    return request({
        url: '/courses/' + pathVariable + '/evaluations',
        method: 'get',
        params
    })
}

export function getChapter(pathVariable, params) {
    return request({
        url: '/chapters/' + pathVariable,
        method: 'get',
        params
    })
}

export function createChapter(data) {
    return request({
        url: '/chapters',
        method: 'post',
        data
    })
}

export function updateChapter(data) {
    return request({
        url: '/chapters',
        method: 'put',
        data
    })
}

export function deleteChapter(pathVariable) {
    return request({
        url: '/chapters/' + pathVariable,
        method: 'delete'
    })
}

export function getQuestion(pathVariable, params) {
    return request({
        url: '/questions/' + pathVariable,
        method: 'get',
        params
    })
}

export function createQuestion(data) {
    return request({
        url: '/questions',
        method: 'post',
        data
    })
}

export function updateQuestion(data) {
    return request({
        url: '/questions',
        method: 'put',
        data
    })
}

export function deleteQuestion(pathVariable) {
    return request({
        url: '/questions/' + pathVariable,
        method: 'delete'
    })
}

export function getAnswersOfQuestion(pathVariable, params) {
    return request({
        url: '/questions/' + pathVariable + '/answers',
        method: 'get',
        params
    })
}

export function createAnswer(data) {
    return request({
        url: '/answers',
        method: 'post',
        data
    })
}

export function updateAnswer(data) {
    return request({
        url: '/answers',
        method: 'put',
        data
    })
}

export function deleteAnswer(pathVariable) {
    return request({
        url: '/answers/' + pathVariable,
        method: 'delete'
    })
}

export function createNote(data) {
    return request({
        url: '/notes',
        method: 'post',
        data
    })
}

export function updateNote(data) {
    return request({
        url: '/notes',
        method: 'put',
        data
    })
}

export function deleteNote(pathVariable) {
    return request({
        url: '/notes/' + pathVariable,
        method: 'delete'
    })
}

export function createEvaluation(data) {
    return request({
        url: '/evaluations',
        method: 'post',
        data
    })
}

export function updateEvaluation(data) {
    return request({
        url: '/evaluations',
        method: 'put',
        data
    })
}

export function deleteEvaluation(pathVariable) {
    return request({
        url: '/evaluations/' + pathVariable,
        method: 'delete'
    })
}

export function getCoursesOfUser(pathVariable, params) {
    return request({
        url: '/users/' + pathVariable + '/courses',
        method: 'get',
        params
    })
}

export function getNotesOfUser(pathVariable, params) {
    return request({
        url: '/users/' + pathVariable + '/notes',
        method: 'get',
        params
    })
}

export function createOrder(data) {
    return request({
        url: '/orders',
        method: 'post',
        data
    })
}

export function updateOrder(data) {
    return request({
        url: '/orders',
        method: 'put',
        data
    })
}

export function payOrder(params) {
    return request({
        url: '/payments',
        method: 'get',
        params
    })
}

export function uploadProfilePicture(data) {
    return request({
        url: '/profile-pictures',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
}

export function uploadCoverPicture(data) {
    return request({
        url: '/cover-pictures',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
}

export function uploadVideo(data, onUploadProgress) {
    return request({
        url: '/videos',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress,
        data
    })
}

// 刷題相關API
export function getQuizQuestionsOfCourse(pathVariable, params) {
    return request({
        url: '/quiz/course/' + pathVariable,
        method: 'get',
        params
    })
}

export function getRandomQuizQuestionsOfCourse(pathVariable, params) {
    return request({
        url: '/quiz/course/' + pathVariable + '/random',
        method: 'get',
        params
    })
}

export function getQuizQuestion(pathVariable, params) {
    return request({
        url: '/quiz/' + pathVariable,
        method: 'get',
        params
    })
}

export function createQuizQuestion(data) {
    return request({
        url: '/quiz',
        method: 'post',
        data
    })
}

export function updateQuizQuestion(data) {
    return request({
        url: '/quiz',
        method: 'put',
        data
    })
}

export function deleteQuizQuestion(pathVariable) {
    return request({
        url: '/quiz/' + pathVariable,
        method: 'delete'
    })
}

export function submitQuizAnswer(pathVariable, data) {
    return request({
        url: '/quiz/' + pathVariable + '/submit',
        method: 'post',
        data
    })
}

// 題庫管理API
export function getAllQuizQuestions(params) {
    return request({
        url: '/quiz/all',
        method: 'get',
        params
    })
}

export function getQuizQuestionsByCourse(courseId, params) {
    return request({
        url: '/quiz/course/' + courseId,
        method: 'get',
        params
    })
}

// 宣傳圖 Banner 管理 API
export function getBanners(params) {
    return request({
        url: '/banners',
        method: 'get',
        params
    })
}

export function createBanner(data) {
    return request({
        url: '/banners',
        method: 'post',
        data
    })
}

export function updateBanner(data) {
    return request({
        url: '/banners',
        method: 'put',
        data
    })
}

export function deleteBanner(id) {
    return request({
        url: '/banners/' + id,
        method: 'delete'
    })
}

// 公司通知/諮詢 API
export function getNotices(params) {
    return request({
        url: '/notices',
        method: 'get',
        params
    })
}

export function getNoticesByPopularity(params) {
    return request({
        url: '/notices',
        method: 'get',
        params: { ...params, orderBy: 'popularity' }
    })
}

export function getNoticesByTime(params) {
    return request({
        url: '/notices',
        method: 'get',
        params: { ...params, orderBy: 'create_time' }
    })
}

// 班級 API
export function getClasses(params) {
    return request({
        url: '/classes',
        method: 'get',
        params
    })
}

export function getClass(pathVariable, params) {
    return request({
        url: '/classes/' + pathVariable,
        method: 'get',
        params
    })
}

export function getClassCourses(classId, params) {
    return request({
        url: '/classes/' + classId + '/courses',
        method: 'get',
        params
    })
}

export function getClassEvaluations(classId, params) {
    return request({
        url: '/classes/' + classId + '/evaluations',
        method: 'get',
        params
    })
}

export function getClassQuiz(classId, params) {
    return request({
        url: '/classes/' + classId + '/quiz',
        method: 'get',
        params
    })
}

export function createClass(data) {
    return request({
        url: '/classes',
        method: 'post',
        data
    })
}

export function updateClass(data) {
    return request({
        url: '/classes',
        method: 'put',
        data
    })
}

export function deleteClass(id) {
    return request({
        url: '/classes/' + id,
        method: 'delete'
    })
}

// 班級課程關聯 API

export function updateClassCourses(classId, data) {
    return request({
        url: '/classes/' + classId + '/courses/batch',
        method: 'post',
        data
    })
}

// 班級成員 API

export function getClassMembers(classId, params) {
    return request({
        url: '/classes/' + classId + '/members',
        method: 'get',
        params
    })
}

export function getUserClasses(userName) {
    return request({
        url: '/classes/' + userName + '/members/user/' + userName,
        method: 'get'
    })
}

export function checkMemberStatus(classId, userName) {
    return request({
        url: '/classes/' + classId + '/members/check/' + userName,
        method: 'get'
    })
}

export function getClassMemberCount(classId) {
    return request({
        url: '/classes/' + classId + '/members/count',
        method: 'get'
    })
}

export function joinClass(classId) {
    return request({
        url: '/classes/' + classId + '/members/join',
        method: 'post'
    })
}

export function exitClass(classId) {
    return request({
        url: '/classes/' + classId + '/members/exit',
        method: 'post'
    })
}

export function createClassMember(classId, data) {
    return request({
        url: '/classes/' + classId + '/members',
        method: 'post',
        data
    })
}

export function updateClassMember(data) {
    return request({
        url: '/classes/members',
        method: 'put',
        data
    })
}

export function deleteClassMember(id) {
    return request({
        url: '/classes/members/' + id,
        method: 'delete'
    })
}