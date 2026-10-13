"use strict";

// Dữ liệu khởi tạo
const items = [
    {
        id: 1,
        title: "Viết báo cáo HTML",
        dueDate: "2026-10-20",
        priority: "Cao",
        status: "pending"
    },
    {
        id: 2,
        title: "Ôn Flexbox",
        dueDate: "2026-10-23",
        priority: "Trung bình",
        status: "pending"
    },
    {
        id: 3,
        title: "Làm bài DOM",
        dueDate: "2026-10-19",
        priority: "Cao",
        status: "done"
    },
    {
        id: 4,
        title: "Đọc tài liệu CSS",
        dueDate: "2026-10-25",
        priority: "Thấp",
        status: "pending"
    },
    {
        id: 5,
        title: "Thiết kế trang cá nhân",
        dueDate: "2026-10-21",
        priority: "Trung bình",
        status: "done"
    }
];

// Lấy các phần tử HTML
const form = document.querySelector("#task-form");
const tencongviec = document.querySelector("#tencongviec");
const hanhoanthanh = document.querySelector("#hanhoanthanh");
const mucuutien = document.querySelector("#mucuutien");
const timkiem = document.querySelector("#search");
const trangthai = document.querySelector("#trangthai");
const danhsachcongviec = document.querySelector("#danhsachcongviec");
const thongbao = document.querySelector("#form-message");

// C1: Hiển thị danh sách công việc
function hienThiDanhSach() {
    danhsachcongviec.replaceChildren();

    const tukhoa = timkiem.value.trim().toLowerCase();

    const danhsach = items.filter(function (item) {
        const dungTen = item.title.toLowerCase().includes(tukhoa);

        const dungTrangThai =
            trangthai.value === "tatca" ||
            (trangthai.value === "chuahoanthanh" &&
                item.status === "pending") ||
            (trangthai.value === "dahoanthanh" &&
                item.status === "done");

        return dungTen && dungTrangThai;
    });

    if (danhsach.length === 0) {
        const thongbaoRong = document.createElement("p");
        thongbaoRong.textContent = "Không có công việc phù hợp.";
        danhsachcongviec.appendChild(thongbaoRong);
        return;
    }

    danhsach.forEach(function (item) {
        const congViec = document.createElement("div");
        congViec.className = "task-item";

        if (item.status === "done") {
            congViec.classList.add("completed");
        }

        const thongTin = document.createElement("div");
        thongTin.className = "task-info";

        const ten = document.createElement("h3");
        ten.className = "task-name";
        ten.textContent = item.title;

        const han = document.createElement("p");
        han.textContent = "Hạn hoàn thành: " +
            (item.dueDate || "Chưa có");

        const uuTien = document.createElement("p");
        uuTien.textContent = "Mức ưu tiên: " + item.priority;

        const trangThaiText = document.createElement("p");
        trangThaiText.textContent = "Trạng thái: " +
            (item.status === "done"
                ? "Đã hoàn thành"
                : "Chưa hoàn thành");

        thongTin.append(ten, han, uuTien, trangThaiText);

        const thaoTac = document.createElement("div");
        thaoTac.className = "task-actions";

        const nutHoanThanh = document.createElement("button");
        nutHoanThanh.type = "button";
        nutHoanThanh.textContent =
            item.status === "done"
                ? "Đánh dấu chưa hoàn thành"
                : "Hoàn thành";

        nutHoanThanh.addEventListener("click", function () {
            capNhatTrangThai(item.id);
        });

        const nutXoa = document.createElement("button");
        nutXoa.type = "button";
        nutXoa.textContent = "Xóa";

        nutXoa.addEventListener("click", function () {
            xoaCongViec(item.id);
        });

        thaoTac.append(nutHoanThanh, nutXoa);
        congViec.append(thongTin, thaoTac);
        danhsachcongviec.appendChild(congViec);
    });
}

// C2: Thêm công việc từ form
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const ten = tencongviec.value.trim();

    if (ten === "") {
        thongbao.textContent = "Vui lòng nhập tên công việc.";
        tencongviec.focus();
        return;
    }

    const congViecMoi = {
        id: Math.max(0, ...items.map(function (item) {
            return item.id;
        })) + 1,
        title: ten,
        dueDate: hanhoanthanh.value,
        priority: mucuutien.value,
        status: "pending"
    };

    items.push(congViecMoi);

    form.reset();
    thongbao.textContent = "Thêm công việc thành công.";

    hienThiDanhSach();
});

// Hiển thị thông báo khi tên bị bỏ trống
tencongviec.addEventListener("invalid", function () {
    thongbao.textContent = "Vui lòng nhập tên công việc.";
});

tencongviec.addEventListener("input", function () {
    thongbao.textContent = "";
});

// C3: Tìm kiếm và lọc trạng thái
timkiem.addEventListener("input", hienThiDanhSach);
trangthai.addEventListener("change", hienThiDanhSach);

// C4: Cập nhật trạng thái công việc theo ID
function capNhatTrangThai(id) {
    const congViec = items.find(function (item) {
        return item.id === id;
    });

    if (congViec) {
        congViec.status =
            congViec.status === "pending" ? "done" : "pending";

        hienThiDanhSach();
    }
}

// C4: Xóa công việc theo ID
function xoaCongViec(id) {
    const viTri = items.findIndex(function (item) {
        return item.id === id;
    });

    if (viTri !== -1) {
        items.splice(viTri, 1);
        hienThiDanhSach();
    }
}

// Hiển thị 5 công việc mẫu khi mở trang
hienThiDanhSach();