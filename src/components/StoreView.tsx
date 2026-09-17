import React, { useState } from 'react';
import { StoreItem, StoreOrder, StudentUser } from '../types';
import { 
  ShoppingBag, 
  Star, 
  Receipt, 
  Truck, 
  MapPin, 
  X, 
  CheckCircle2, 
  PackageCheck,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StoreViewProps {
  storeItems: StoreItem[];
  orders: StoreOrder[];
  currentUser: StudentUser;
  onRedeemItem: (order: StoreOrder) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const StoreView: React.FC<StoreViewProps> = ({
  storeItems,
  orders,
  currentUser,
  onRedeemItem,
  showToast
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [showOrdersModal, setShowOrdersModal] = useState<boolean>(false);

  // Form states for checkout
  const [recipientName, setRecipientName] = useState<string>(currentUser.name);
  const [address, setAddress] = useState<string>('Hostel Block A, Room 302, Campus');
  const [city, setCity] = useState<string>('New Delhi');
  const [pincode, setPincode] = useState<string>('110016');

  const categories = ['All', 'Exam Essentials', 'Study Aids', 'Desk Stationary', 'Apparel'];

  const filteredItems = activeCategory === 'All'
    ? storeItems
    : storeItems.filter(item => item.category === activeCategory);

  const handleOpenCheckout = (item: StoreItem) => {
    if (currentUser.stars < item.star_cost) {
      showToast(`You need ${item.star_cost} stars! Complete syllabus modules or answer peer doubts to earn more.`, 'warning');
      return;
    }
    setSelectedItem(item);
    setRecipientName(currentUser.name);
  };

  const handleConfirmRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    if (currentUser.stars < selectedItem.star_cost) {
      showToast(`Insufficient stars! You need ${selectedItem.star_cost} stars.`, 'error');
      return;
    }

    const newOrder: StoreOrder = {
      id: `ORD-SIH-${Math.floor(100000 + Math.random() * 900000)}`,
      user_id: currentUser.id,
      item_id: selectedItem.id,
      item_name: selectedItem.name,
      star_cost: selectedItem.star_cost,
      recipient_name: recipientName,
      shipping_address: address,
      city: city,
      pincode: pincode,
      status: 'Confirmed',
      ordered_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    onRedeemItem(newOrder);
    setSelectedItem(null);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    showToast(`🎉 Order confirmed! Tracking ID: ${newOrder.id}. Enjoy your ${newOrder.item_name}!`, 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Store Banner */}
      <div 
        id="store-hero-banner"
        className="rounded-3xl glass-panel p-5 sm:p-8 border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-slate-900 to-indigo-950/40 relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-2">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>Tangible Study Supplies for Board & Competitive Exam Success</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              EduBazaar Stationary & Exam Perks
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-xl leading-relaxed">
              Convert your daily study effort into real-world stationery! Redeem OMR practice sheets, master formula wall charts, book stands, and motivational tees using the <strong className="text-amber-400">Stars</strong> you earned.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 star-glow">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Your Spendable Balance</p>
              <p className="text-2xl font-black text-amber-400 font-mono" id="store-user-balance">
                {currentUser.stars} Stars
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories & Orders History Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-store-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat === 'All' ? 'All Items' : cat}
            </button>
          ))}
        </div>

        <button
          id="view-orders-modal-btn"
          onClick={() => setShowOrdersModal(true)}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-2 transition"
        >
          <Receipt className="w-3.5 h-3.5 text-amber-400" />
          <span>My Redemptions ({orders.length})</span>
        </button>
      </div>

      {/* Store Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {filteredItems.map((item) => {
          const canAfford = currentUser.stars >= item.star_cost;
          return (
            <div
              key={item.id}
              id={`store-item-card-${item.id}`}
              className="glass-panel glass-panel-hover rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="h-44 relative overflow-hidden bg-slate-900">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-indigo-600/90 text-white shadow-md">
                      {item.badge}
                    </span>
                  )}
                  <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-950/80 text-slate-300">
                    {item.stock} in stock
                  </span>
                </div>

                <div className="p-4">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                    {item.category}
                  </span>
                  <h4 className="font-bold text-sm text-white leading-snug mt-1">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mb-3">
                  <span className="text-xs text-slate-400">Reward Cost</span>
                  <span className="text-base font-black text-amber-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{item.star_cost}</span>
                  </span>
                </div>

                <button
                  id={`redeem-btn-${item.id}`}
                  onClick={() => handleOpenCheckout(item)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                    canAfford
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{canAfford ? 'Redeem with Stars' : `Need ${item.star_cost - currentUser.stars} more stars`}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout Modal */}
      {selectedItem && (
        <div 
          id="checkout-order-modal"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div className="w-full max-w-md glass-panel rounded-3xl border border-amber-500/40 p-5 sm:p-6 relative my-auto shadow-2xl">
            <button
              id="close-checkout-modal-btn"
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-4 pr-6">
              <img
                src={selectedItem.image_url}
                alt={selectedItem.name}
                className="w-16 h-16 rounded-xl object-cover border border-slate-700 flex-shrink-0"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Star Redemption
                </span>
                <h4 className="text-sm font-bold text-white leading-tight mt-0.5">
                  {selectedItem.name}
                </h4>
                <p className="text-xs font-bold text-amber-400 mt-1 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{selectedItem.star_cost} Stars</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmRedeem} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Student Recipient Name
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Campus Hostel / Delivery Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Block C, Room 204, Campus Hostel"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  id="confirm-redeem-btn"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  <PackageCheck className="w-4 h-4 text-slate-950" />
                  <span>Confirm Order & Deduct {selectedItem.star_cost} Stars</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Orders Tracking Modal */}
      {showOrdersModal && (
        <div 
          id="orders-tracking-modal"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div className="w-full max-w-lg glass-panel rounded-3xl border border-slate-700 p-5 sm:p-6 relative my-auto shadow-2xl">
            <button
              id="close-orders-modal-btn"
              onClick={() => setShowOrdersModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-amber-400" />
              <span>My Stationary Redemptions</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Track shipments of study supplies redeemed using your earned stars
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {orders.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">
                  No redemptions yet. Complete modules to earn stars and order your first reward!
                </p>
              ) : (
                orders.map((o) => (
                  <div
                    key={o.id}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white leading-tight">
                          {o.item_name}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          o.status === 'Delivered'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-indigo-500/20 text-indigo-300'
                        }`}>
                          {o.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Order ID: <span className="font-mono text-slate-300">{o.id}</span> • {o.ordered_at}
                      </p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>Shipped to: {o.shipping_address}, {o.city} ({o.recipient_name})</span>
                      </p>
                    </div>

                    <div className="text-right sm:flex-shrink-0">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{o.star_cost} Stars</span>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowOrdersModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
