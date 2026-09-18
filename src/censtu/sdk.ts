/**
 * SDK nói chuyện với portal CenStu (`game.censtu.com`).
 *
 * 🔴 NGUỒN GỐC của hợp đồng này KHÔNG phải file này. Bản chính tắc sống ở repo CENSTU:
 *    `fe-censtu/shared/src/types/troChoiNhung.ts`  (`TinNhanTuGame`, `docTinNhanTuGame`)
 * Phần khai kiểu dưới đây là bản CHÉP (theo `typing-10-fingers/src/censtu/sdk.ts`) — game ở repo
 * riêng nên không `import` được từ `@censtu/shared`. Đổi hợp đồng thì đổi ở đó TRƯỚC, rồi chép lại
 * sang đây.
 *
 * Quy trình triển khai + lý do game ở repo riêng: `CENSTU:docs/games/trien-khai-game.md`.
 *
 * 🔴 Chỗ canh hai bản lệch nhau KHÔNG phải TypeScript — nó là test Playwright của portal
 * (`web-game/tests/e2e/trangChoiGame.spec.ts`) bắn một message THẬT. Đổi tên một `loai` ở đây mà
 * quên phía kia thì cả hai bên vẫn biên dịch sạch, và triệu chứng là màn chờ của portal không bao
 * giờ tắt.
 */

/** Origin của portal. Mọi message gửi đi phải nêu nó TƯỜNG MINH, không dùng `'*'`. */
const PORTAL_ORIGIN = 'https://game.censtu.com';

/**
 * Chế độ có ván THẬT — mốc bắt đầu/kết thúc nằm trong luật chơi, không phải do SDK đặt ra.
 *
 * - `me-cung-o-so`: mê cung ô số (Bản Đồ, Chơi Nhanh, Tự Chọn). Ván = một mê cung, từ nước đi
 *   đầu tiên tới lúc chạm ô đích.
 * - `phieu-me-cung`: Phiếu Mê Cung. Ván = một phiếu, từ câu trả lời đầu tiên tới lúc về đích.
 *
 * Soạn Đề, Cửa Hàng, Xếp Hạng không có ván — chúng chỉ phát `censtu:san-sang`.
 */
export type CheDoChoi = 'me-cung-o-so' | 'phieu-me-cung';

/**
 * Một nước đi trong mê cung ô số: ô đích `x`,`y`; `ok` = ô đó hợp luật (bước đi được) hay bị
 * chặn; `t` = mili giây kể từ nước đi đầu tiên.
 */
export interface NuocDi {
  x: number;
  y: number;
  ok: boolean;
  t: number;
}

/** Một câu trả lời ở Phiếu Mê Cung: cổng `c`, đáp án chọn `a`, `ok` đúng/sai, `t` như trên. */
export interface CauTraLoi {
  c: number;
  a: number;
  ok: boolean;
  t: number;
}

export type BangChung =
  | {
      /** Mê cung của ván: đủ để BE soát lại từng nước đi có hợp luật không. */
      meCung: {
        luat: string;
        rong: number;
        cao: number;
        batDau: [number, number];
        dich: [number, number];
        /** `oHopLe[y][x]` — ô đi được (kể cả ô đích). */
        oHopLe: boolean[][];
      };
      nuocDi: NuocDi[];
    }
  | {
      chuDe: string;
      cong: { c: number; dapAn: number }[];
      traLoi: CauTraLoi[];
    };

type TinNhanTuGame =
  | { loai: 'censtu:san-sang' }
  | { loai: 'censtu:bat-dau-van'; cheDo: CheDoChoi }
  | { loai: 'censtu:ket-thuc-van'; cheDo: CheDoChoi; bangChung: BangChung };

/**
 * Game có đang chạy trong khung nhúng của portal không.
 *
 * <p>Export vì giao diện cũng cần biết: thanh về kho trò chơi và chân trang chỉ có nghĩa khi chạy
 * độc lập, và bố cục phải gọn lại cho vừa khung nhúng.
 *
 * <p>🔴 Kiểm trước khi gửi, vì game **cũng chạy độc lập** ở `me-cung-toan-hoc.censtu.com`. Gửi lên
 * `window.parent` khi không có cha thì `parent === window`, tức game tự bắn message cho chính mình.
 */
export function dangNhungTrongPortal(): boolean {
  return typeof window !== 'undefined' && window.parent !== window;
}

function gui(tin: TinNhanTuGame): void {
  if (!dangNhungTrongPortal()) return;

  /*
   * `targetOrigin` tường minh, KHÔNG `'*'` — với `'*'` thì bất kỳ trang nào đang nhúng game này
   * cũng đọc được nội dung message. Trình duyệt tự bỏ message khi origin của cha không khớp.
   */
  window.parent.postMessage(tin, PORTAL_ORIGIN);
}

/** Game đã tải xong và chơi được. Portal tắt màn chờ ở đây — gọi nó MỘT lần lúc app mount. */
export function baoSanSang(): void {
  gui({ loai: 'censtu:san-sang' });
}

/** Người chơi vừa thực hiện hành động đầu tiên của một ván. */
export function baoBatDauVan(cheDo: CheDoChoi): void {
  gui({ loai: 'censtu:bat-dau-van', cheDo });
}

/**
 * Ván kết thúc.
 *
 * <p>🔴 `bangChung` là thứ BE dùng để **TÍNH LẠI** điểm — nộp nhật ký thao tác kèm mốc thời gian,
 * không nộp điểm số đã tính sẵn.
 */
export function baoKetThucVan(cheDo: CheDoChoi, bangChung: BangChung): void {
  gui({ loai: 'censtu:ket-thuc-van', cheDo, bangChung });
}
