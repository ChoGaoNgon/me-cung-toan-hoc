/**
 * Kịch bản nghiệm thu nhúng portal CenStu — chạy bằng `kiem-nhung.mjs` của skill `censtu-them-game`:
 *
 *   npm run build
 *   node ~/.claude/skills/censtu-them-game/scripts/kiem-nhung.mjs --dist ./dist \
 *     --kich-ban ./scripts/kich-ban-nghiem-thu.js --ghi-message /tmp/message.json
 *
 * File này là THÂN của một hàm async chạy ở trang cha (portal giả lập). Có sẵn: doi(ms), khung,
 * D(), nut(nhãn), doMan(tên). Chạy ở 1366×768.
 *
 * Lái: hai ván mê cung ô số liền nhau (ván 2 qua nút "Chơi Lại" ở màn chiến thắng) + một phiếu
 * mê cung. KHẲNG ĐỊNH: mỗi `ket-thuc-van` chỉ chứa đúng các thao tác của ván đó.
 */

const W = () => khung.contentWindow;
const cho = async (dk, moTa, lan = 100) => {
  for (let i = 0; i < lan; i++) {
    if (dk()) return;
    await doi(100);
  }
  throw new Error('hết giờ chờ: ' + moTa);
};
const tin = (loai) => window.batDuoc.filter((m) => m.tin.loai === loai);
const theoId = (id) => D().getElementById(id);
/** Nút phải nhìn thấy được mà không cuộn: nằm trọn trong <main> và trong khung. */
const phaiThay = (el, moTa) => {
  const r = el.getBoundingClientRect();
  const m = D().querySelector('main').getBoundingClientRect();
  if (r.top < m.top - 1 || r.bottom > Math.min(m.bottom, W().innerHeight) + 1)
    throw new Error(`${moTa} nằm ngoài vùng nhìn thấy: ${Math.round(r.top)}–${Math.round(r.bottom)}, main ${Math.round(m.top)}–${Math.round(m.bottom)}`);
};

// ---------- Màn đầu: Bản Đồ ----------
await cho(() => theoId('nav-tab-quick_play'), 'game mount');
await doi(600);
doMan('Bản Đồ');

// ---------- Mê cung ô số ----------
theoId('nav-tab-quick_play').click();
await cho(() => theoId('btn-start-quick-maze'), 'màn Chơi Nhanh');
doMan('Chơi Nhanh — chọn đề');
phaiThay(theoId('btn-start-quick-maze'), 'nút BẮT ĐẦU (Chơi Nhanh)');
theoId('btn-start-quick-maze').click();
await cho(() => theoId('tile-cell-0-0'), 'mê cung');
await doi(300);
doMan('Mê cung ô số — đang chơi');
phaiThay(theoId(`tile-cell-${D().querySelectorAll('[id^="tile-cell-"]').length ** 0.5 - 1}-${D().querySelectorAll('[id^="tile-cell-"]').length ** 0.5 - 1}`), 'ô đích mê cung');

const HUONG = [
  ['ArrowUp', 0, -1],
  ['ArrowDown', 0, 1],
  ['ArrowLeft', -1, 0],
  ['ArrowRight', 1, 0],
];
const viTri = () => {
  const o = [...D().querySelectorAll('[id^="tile-cell-"]')].find((c) =>
    c.querySelector(':scope > .z-30.pointer-events-none'),
  );
  const [, x, y] = o.id.match(/tile-cell-(\d+)-(\d+)/);
  return { x: +x, y: +y };
};
const xong = () => Boolean(theoId('btn-modal-replay'));

/** Giải mê cung bằng DFS qua bàn phím; trả về số phím đã bấm (= số nước đi phải có trong nhật ký). */
async function giaiMeCung() {
  let soPhim = 0;
  const daQua = new Set();
  const bam = async (phim) => {
    const w = W();
    w.dispatchEvent(new w.KeyboardEvent('keydown', { key: phim, bubbles: true }));
    soPhim++;
    await doi(40);
  };
  async function dfs() {
    const p = viTri();
    daQua.add(p.x + ',' + p.y);
    for (const [phim, dx, dy] of HUONG) {
      if (xong()) return true;
      const k = p.x + dx + ',' + (p.y + dy);
      if (daQua.has(k) || !theoId(`tile-cell-${p.x + dx}-${p.y + dy}`)) continue;
      await bam(phim);
      if (xong()) return true;
      const q = viTri();
      if (q.x === p.x && q.y === p.y) {
        daQua.add(k); // ô bị chặn
        continue;
      }
      if (await dfs()) return true;
      const nguoc = HUONG.find(([, ddx, ddy]) => ddx === -dx && ddy === -dy)[0];
      await bam(nguoc);
    }
    return false;
  }
  if (!(await dfs())) throw new Error('DFS không tới được đích');
  return soPhim;
}

const phimVan1 = await giaiMeCung();
await cho(xong, 'màn chiến thắng ván 1');
await doi(400);
doMan('Mê cung ô số — chiến thắng');
for (const id of ['btn-modal-replay', 'btn-modal-menu', 'btn-modal-next']) {
  // Modal `fixed` phủ cả khung, không thuộc <main> — chỉ cần nằm trong khung.
  const r = theoId(id).getBoundingClientRect();
  if (r.bottom > W().innerHeight) throw new Error(`${id} dưới nếp gấp: ${Math.round(r.bottom)} > ${W().innerHeight}`);
}

theoId('btn-modal-replay').click(); // đường vào ván mới thứ hai — nhật ký phải reset
await cho(() => !xong(), 'ván 2 mở');
await doi(300);
const phimVan2 = await giaiMeCung();
await cho(xong, 'màn chiến thắng ván 2');

const ketThucMeCung = tin('censtu:ket-thuc-van').filter((m) => m.tin.cheDo === 'me-cung-o-so');
const batDauMeCung = tin('censtu:bat-dau-van').filter((m) => m.tin.cheDo === 'me-cung-o-so');
const doDai = ketThucMeCung.map((m) => m.tin.bangChung.nuocDi.length);
if (batDauMeCung.length !== 2) throw new Error(`me-cung-o-so: cần 2 bat-dau-van, có ${batDauMeCung.length}`);
if (doDai.join() !== [phimVan1, phimVan2].join())
  throw new Error(`nhật ký mê cung không reset: độ dài ${doDai} ≠ số phím ${phimVan1},${phimVan2}`);
console.log(`mê cung: nhật ký ${doDai} = số phím ${phimVan1},${phimVan2} ✓`);

// ---------- Phiếu mê cung ----------
theoId('btn-modal-menu').click();
await cho(() => theoId('nav-tab-worksheet_play'), 'về bản đồ');
theoId('nav-tab-worksheet_play').click();
await cho(() => D().querySelector('[id^="btn-bottom-door-"]'), 'phiếu mê cung');
await doi(300);
doMan('Phiếu Mê Cung — đang chơi');
for (const b of D().querySelectorAll('[id^="btn-bottom-door-"]')) phaiThay(b, 'nút đáp án phiếu');

let soTraLoi = 0;
for (let vong = 0; vong < 40; vong++) {
  if (D().body.textContent.includes('CHÚC MỪNG EM ĐÃ ĐƯA NHÂN VẬT VỀ ĐÍCH')) break;
  // Chờ nhân vật đi xong (nút đáp án bị disabled khi đang bước)
  await cho(
    () =>
      D().body.textContent.includes('CHÚC MỪNG EM ĐÃ ĐƯA NHÂN VẬT VỀ ĐÍCH') ||
      [...D().querySelectorAll('[id^="btn-bottom-door-"]')].some((b) => !b.disabled),
    'nút đáp án mở',
    300,
  );
  const cacNut = [...D().querySelectorAll('[id^="btn-bottom-door-"]')].filter((b) => !b.disabled);
  if (!cacNut.length) continue;
  // Thử lần lượt: đáp án sai cũng vào nhật ký, đúng thì nhân vật bắt đầu đi.
  for (const b of cacNut) {
    b.click();
    soTraLoi++;
    await doi(1100); // nút sai: rung 1s
    // Đúng ⇒ sau ~850ms nhân vật bắt đầu đi, mọi nút đáp án bị disabled.
    if (b.disabled || !b.isConnected) break;
  }
}
await cho(() => tin('censtu:ket-thuc-van').some((m) => m.tin.cheDo === 'phieu-me-cung'), 'ket-thuc-van phiếu', 300);
await doi(400);
doMan('Phiếu Mê Cung — về đích');
phaiThay(nut('Chơi Lại Mê Cung Này 🔄'), 'nút Chơi Lại (phiếu)');
const phieu = tin('censtu:ket-thuc-van').find((m) => m.tin.cheDo === 'phieu-me-cung');
if (phieu.tin.bangChung.traLoi.length !== soTraLoi)
  throw new Error(`phiếu: nhật ký ${phieu.tin.bangChung.traLoi.length} ≠ số lần bấm ${soTraLoi}`);
console.log(`phiếu: nhật ký ${soTraLoi} câu trả lời ✓`);

// ---------- Các màn phụ (được phép tự cuộn) ----------
for (const [id, ten] of [
  ['nav-tab-shop', 'Cửa Hàng'],
  ['nav-tab-leaderboard', 'Xếp Hạng'],
  ['nav-tab-teacher_studio', 'Soạn Đề'],
]) {
  theoId(id).click();
  await doi(700);
  doMan(ten);
}
