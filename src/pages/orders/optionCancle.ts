interface IOptionCancle {
    id: string,
    lable: string,
    value: string,
}

const options: Readonly<IOptionCancle[]> = [
    {
        id: "1",
        lable: "Hết hàng",
        value: "Hết hàng"
    },
    {
        id: "2",
        lable: "Không liên hệ được với khách hàng",
        value: "Không liên hệ được với khách hàng"
    },
    {
        id: "3",
        lable: "Khách hàng muốn hủy đơn hàng",
        value: "Khách hàng muốn hủy đơn hàng"
    },
]

export default options;