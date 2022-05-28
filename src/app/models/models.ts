import {Platform_Domain, Platform_Store} from './PlatformModels';
import { Attachment, Category, Stock_Record, Item, Shipping, Shipping_Item, Item_Exception, Purchase_Detail, Purchase, Merma, Returns, Returned_Item, Requisition_Item, Requisition, Quote, Quote_Item } from './RestModels';
import { Session,User, Bank_Movement_Bill, Bill, Bank_Movement, Bank_Account } from './RestModels';
import { User_Permission, Box, Box_Content, Stocktake_Item, Stocktake_Scan } from './RestModels';
import { Stocktake, Item_Option, Item_Option_Value, Bank_Movement_Order } from './RestModels';
import { Payment, Address, Cash_Close, Fund } from './RestModels';
import { File_Type, Store, Price, Price_Type, Order_Item,Order } from './RestModels';
import { Pallet_Content, Pallet } from './RestModels';


export interface Order_Report extends Order
{
	order_count:number;
	tax_total:number;
	grand_total:number;
	paid_total:number;
}

export interface SocketMessage
{
	type:string;
	store_id:number;
	order_id?:number;
	message?:string;
}

export interface AttachmentInfo
{
	attachment:Attachment;
	file_type?:File_Type;
}

export interface LoginResponse
{
	token: String;
	user: User;
	session: Session;
}

export interface UserInfo
{
	user?:User;
	billing_address?:Address;
	shipping_address?:Address;
	addresses?:Address[];
}

export interface LoginResponse
{
	token: String;
	user: User;
	session: Session;
	user_permission: User_Permission;
}

export interface DisponibilidadRegistroMarbete
{
	available:number;
	asigned:number;
	first_available: number | null;
	last_available: number | null;
}

export interface DisponibilidadProduction
{
	con_marbete:number;
	sin_marbete:number;
	destruidos:number;
	primer_botella_sin_marbete:number;
}

//export interface ProduccionInfo
//{
//	produccion:Produccion;
//	disponibilidad:DisponibilidadProduccion;
//	detalles:Produccion_Detalle[];
//}

//export interface ProductionInfo
//{
//	production:Production;
//	availability:DisponibilidadProduction;
//	items:Production_Item[];
//	total?:number;
//	total_content?:number;
//}

export interface ShippingItemInfo
{
	item?: Item;
	shipping_item:Shipping_Item;
	category?:Category;
	available?:number;
	box_info?:BoxInfo;
	pallet_info?:PalletInfo;
}

export interface ShippingInfo
{
	shipping:Partial<Shipping>;
	items:Partial<ShippingItemInfo>[];
	purchase?:Purchase;
}

export interface StockRecordInfo
{
	category:Category | null;
	item:Item;
	stock_record:Stock_Record;
}

export interface SerialNumberRecordInfo
{

}

export interface ItemOptionValueInfo
{
	option_value: Item_Option_Value;
	item:Item;
	category?:Category;
}

export interface ItemOptionInfo
{
	item_option:Item_Option;
	//option:Option;
	values:ItemOptionValueInfo[];
}

export interface ItemInfo
{
	item:Item;
	category?:Category;
	//product?:Product; //Category
	//item_options?:ItemOptionInfo[];
	//attributes?:Item_Attribute[];

	price?:Price;
	prices:Price[];
	records:Stock_Record[];
	stock_record?:Stock_Record;
	options:ItemOptionInfo[];
	exceptions:Item_Exception[];
	display_category?:boolean;
}

export interface OrderItemInfo extends ItemInfo
{
	order_item:Order_Item; //Obligatorio
	created:Date;
}

export interface OrderInfo
{
	id?:number; //en offline
	order: Order; //Obligatorio
	items: OrderItemInfo[]; //Obligatorio
	structured_items: OrderItemInfo[]; //Obligatorio
	client: User | null;
	cashier: User | null;
	delivery_user: User | null;
	price_type?: Price_Type;
	store?: Store;
}

export interface PartialOrderInfo
{
	order: Partial<Order>;
	items: Partial<OrderItemInfo>[];
	client?:User;
	cashier?:User;
	price_type?:Price_Type;
	store?:Store;
}

export interface ItemStockInfo extends ItemInfo
{
	total:number;
}

export interface BankMovementBillInfo
{
	bank_movement_bill?:Bank_Movement_Bill;
	bill?:Bill;
	invoice_attachment?:Attachment | null;
	//invoice_file_type?:File_Type;
	receipt_attachment?:Attachment | null;
	//receipt_file_type?:File_Type;
}

export interface BankMovementInfo
{
	bank_movement:Bank_Movement;
	bank_account?:Bank_Account;
	provider?:User;
	invoice_attachment?:Attachment;
	invoice_file_type?:File_Type;

	receipt_attachment?:Attachment;
	receipt_file_type?:File_Type;

	bank_movement_bills?:BankMovementBillInfo[];
	bank_movement_orders?:Bank_Movement_Order[];
}


export interface BoxContentInfo
{
	box_content:Box_Content;
	item:Item;
	category:Category;
}
export interface BoxInfo
{
	box: Box;
	content: BoxContentInfo[];
	pallet_content?:Pallet_Content;
}

export interface PalletContentInfo extends BoxInfo
{
	pallet_content:Pallet_Content;
}
export interface PalletInfo
{
	pallet:Pallet;
	content: PalletContentInfo[];
}

export interface CategoryStock extends Category
{
	total:number;
}

export interface StoreStock extends Store
{
	total:number;
}

export interface TagStock
{
	tag:string;
	total:number;
}

export interface TotalSalesByStore
{
	store_id:number;
	name:string;
	total:number;
	pending:number;
}

export interface BillInfo
{
	bill:Bill
	provider?:User;
//	organization?:Organization;
	bank_account?:Bank_Account;
	invoice_attachment?:Attachment;
	receipt_attachment?:Attachment;
	pdf_attachment?:Attachment;
	invoice_file_type?:File_Type;
	bank_movements_info:BankMovementInfo[];
	paid_by_user: User;
	approved_by_user: User;
}

export interface StocktakeScanInfo
{

}

export interface StocktakeItemInfo
{
	category?:Category;
	item?:Item;
	pallet?:Pallet;
	box?:Box;
	box_content?:Box_Content;
	stocktake_item?:Stocktake_Item;
	stocktake_scan?:Stocktake_Scan;
	pallet_content?:Pallet_Content;
}

export interface StocktakeInfo
{
	store:Store;
	stocktake:Stocktake;
	items:StocktakeItemInfo[];
}

export interface PaymentInfo
{
	payment:Payment;
	movements:BankMovementInfo[];
	paid_by_user:User | null;
	created_by_user:User;
	store:Store | null;
	order_sync_id?:string | null;
	offline_order_id?:number | null;
}

export interface CashCloseInfo
{
	cash_close: Cash_Close;
	user?:User | null;
	funds:Fund[];
	store?:Store | null;
	payments:Payment[];
	orders?:Order[];
	item_sales:Record<string,any>[];
	movements:Bank_Movement[];
}

export interface SplitOrderRequestItem
{
	order_item_id:number;
	qty:number;
}

export interface SplitOrderRequest
{
	order_id:number;
	items: SplitOrderRequestItem[];
}

export interface PurchaseDetailInfo
{
	purchase_detail:Purchase_Detail;
	item:Item;
	category:Category;
}
export interface PurchaseInfo extends Partial<BillInfo>
{
	purchase: Purchase;
	details: PurchaseDetailInfo[];
}

/* Google geocodigin response */

export interface GeocodingAddressComponent
{
	long_name:string,
	short_name:string,
	types:string[]
}

export interface LatLng
{
	lat:number;
	lng:number;
}
export interface GeocodingGeometry
{
	location: LatLng;
	location_type:string;
	view_port:Record<string,LatLng>;
}
export interface GeocodingResult
{
	address_components: GeocodingAddressComponent[];
	formatted_address: string;
	geometry:GeocodingGeometry;
	place_id:string;
	plus_code:Record<string,string>;
}

export interface GeocodingResponse
{
	results:GeocodingResult[];
	status:string;
}

export interface MermaInfo
{
	merma?: Merma;
	item?: Item | null;
	category?: Category | null;
	user?:User | null;
}

export interface PlatformStoreInfo
{
	store:Platform_Store,
	domains:Platform_Domain[];
}

export interface FacturacionRequest
{
	facturacion_code:string;
	rfc:string;
	razon_social:string;
	email:string;
}
export interface PriceResume
{
	category_id:number;
	price_list_id:number;
	min_price:number | null;
	max_price:number | null;
	price_count:number;
	price_avg:number | null;
}

export interface CategoryInfo
{
	category:Category;
	price_resume:PriceResume[];
}

export interface RequisitionItemInfo
{
	requisition_item:Requisition_Item;
	item: Item;
	category:Category;
}

export interface RequisitionInfo
{
	requisition:Requisition;
	items:RequisitionItemInfo[];
	required_by_store?:Store;
	requested_to_store?:Store;
	user?:User;
	shipping?:Shipping | null;
}


export interface ItemStockInfo extends ItemInfo
{
	total:number;
}

export interface UserBalance extends User
{
	balance:number;
}

export interface ReturnItemInfo
{
	returned_item:Returned_Item;
	item:Item;
	category:Category | null;
}

export interface ReturnsInfo
{
	returns:Returns;
	items:ReturnItemInfo[];
	cashier_user:User;
	client_user:User | null;
	store:Store;
}

export interface SearchTerm
{
	term: string;
	position: number;
	item_id: number;
}

export interface ProductoOServicio{
	value:string;
	option:string;
}


export interface QuoteItemInfo
{
	item:Item;
	quote_item:Quote_Item;
	category?:Category;
}

export interface StockRecordInfo
{
	order:Order | null;
	stock_record:Stock_Record;
	item:Item;
	category:Category | null;
	shipping:Shipping | null;
	purchase:Purchase | null;
	store:Store;
	user:User|null;
}

export interface QuoteInfo
{
	quote: Quote;
	client_user:User | null;
	store:Store | null;
	items: QuoteItemInfo[];
	order: Order | null;
}


export interface OrderItemStructureInfo extends OrderItemInfo
{
	childs:OrderItemInfo[];
}

export const OFFLINE_DB_SCHEMA = {
	name: 'offline_db',
	version: 17,
	schema: {
		order_info:"++id,&order.sync_id,&order.id",
		item_info:"item.id,item.category_id",
		category:"id",
		item_terms: "++id,item_id,term",
		payment_info:"&payment.sync_id,order_id,order_sync_id",
		store:"id,name",
		price_type: "id,name",
		currency_rate:"id,currency_rate"
	}
};
