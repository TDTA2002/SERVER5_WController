import { TextType } from "./en";

const data: TextType = {
    /* Mail */
    signature: "Chúc bạn một ngày tốt lành",
    hello: "Xin Chào",
    intro: `Cảm ơn bạn đã tham gia cộng đồng ${process.env.APP_NAME}! Chúng tôi rất vui vì điều đó!`,
    instructionOne: "Để xác thực email cho tài khoản ",
    instructionTwo: " vui lòng bấm vào liên kết bên dưới:",
    mailBtnText: "Xác thực email",
    outro: "Cần giúp hoặc có câu hỏi? Chỉ cần trả lời email này, chúng tôi rất sẵn lòng trợ giúp",
    /* Api */
    modelErr: "Lỗi Model",
    userNameDuplicate: "Username đã tồn tại",
    emailDuplicate: "Email đã tồn tại",
    registerSuccess: "Đăng ký thành công",
    ipAcceptDenine: "Địa chỉ IP không được chấp nhận",
    updateSuccess: "Update thành công",

    /* Login Api */
    error001: "Tài khoản đang bị tạm khoá",
    error002: "Mật khẩu không chính xác",
    error003: "Người dùng không tồn tại",
    success001: "Đăng nhập thành công",
}

export default data