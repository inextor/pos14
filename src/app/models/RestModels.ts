/*GENERATED AUTOMATICALLY PLEASE DO NOT EDIT */

export interface Address{
	address:string;
	city:string | null;
	country:string | null;
	created:Date | null;
	email:string | null;
	id:number;
	lat:number | null;
	lng:number | null;
	name:string;
	note:string | null;
	phone:string | null;
	rfc:string | null;
	state:string | null;
	status:'ACTIVE'|'DELETED';
	suburb:string | null;
	type:'BILLING'|'SHIPPING'|'BILLING_AND_SHIPPING';
	updated:Date | null;
	user_id:number;
	zipcode:string | null;
}
export interface Attachment{
	content_type:string;
	created:Date | null;
	file_type_id:number | null;
	filename:string | null;
	height:number | null;
	id:number;
	original_filename:string;
	size:number | null;
	status:'ACTIVE'|'DELETED';
	updated:Date | null;
	uploader_user_id:number | null;
	width:number | null;
}
export interface Bank_Account{
	account:string;
	alias:string;
	bank:string;
	created:Date | null;
	currency:string;
	email:string | null;
	id:number;
	is_a_payment_method:'NO'|'YES';
	name:string;
	updated:Date | null;
	user_id:number | null;
}
export interface Bank_Movement{
	amount_received:number;
	bank_account_id:number | null;
	card_ending:string | null;
	client_user_id:number | null;
	created:Date | null;
	currency_id:string;
	id:number;
	invoice_attachment_id:number | null;
	note:string | null;
	paid_date:string | null;
	payment_id:number | null;
	provider_user_id:number | null;
	receipt_attachment_id:number | null;
	received_by_user_id:number;
	reference:string | null;
	status:'ACTIVE'|'DELETED';
	total:number;
	transaction_type:'CASH'|'CREDIT_CARD'|'DEBIT_CARD'|'CHECK'|'COUPON'|'TRANSFER'|'DISCOUNT'|'RETURN_DISCOUNT'|'PAYPAL';
	type:'expense'|'income';
	updated:Date | null;
}
export interface Bank_Movement_Bill{
	amount:number;
	bank_movement_id:number;
	bill_id:number;
	created:Date | null;
	currency_amount:number;
	currency_id:string;
	exchange_rate:number;
	id:number;
	updated:Date | null;
}
export interface Bank_Movement_Order{
	amount:number;
	bank_movement_id:number;
	created:Date | null;
	created_by_user_id:number | null;
	currency_amount:number;
	currency_id:string;
	exchange_rate:number;
	id:number;
	order_id:number;
	status:'ACTIVE'|'DELETED';
	updated:Date | null;
	updated_by_user_id:number | null;
}
export interface Bill{
	accepted_status:'PENDING'|'ACCEPTED'|'REJECTED';
	amount_paid:number;
	aproved_by_user_id:number | null;
	bank_account_id:number | null;
	created:Date | null;
	currency_id:string;
	due_date:string | null;
	folio:string | null;
	id:number;
	invoice_attachment_id:number | null;
	name:string;
	note:string | null;
	organization_id:number | null;
	paid_by_user_id:number | null;
	paid_date:string | null;
	paid_status:'PENDING'|'PAID';
	paid_to_bank_account_id:number | null;
	pdf_attachment_id:number | null;
	provider_user_id:number | null;
	purchase_id:number | null;
	receipt_attachment_id:number | null;
	status:'DELETED'|'ACTIVE';
	total:number;
	updated:Date | null;
}
export interface Billing_Data{
	created:Date | null;
	created_by_user_id:number | null;
	id:number;
	password:string;
	rfc:string;
	updated:Date | null;
	updated_by_user_id:number | null;
	usuario:string;
}
export interface Box{
	created:Date | null;
	id:number;
	production_item_id:number | null;
	serial_number_range_end:number | null;
	serial_number_range_start:number | null;
	status:'ACTIVE'|'DELETED';
	store_id:number | null;
	type_item_id:number;
	updated:Date | null;
}
export interface Box_Content{
	box_id:number;
	id:number;
	initial_qty:number;
	item_id:number;
	qty:number;
	serial_number_range_end:number | null;
	serial_number_range_start:number | null;
}
export interface Brand{
	created:Date | null;
	created_by_user_id:number | null;
	description:string | null;
	id:number;
	image_id:number | null;
	name:string;
	updated:Date | null;
	updated_by_user_id:number | null;
}
export interface Cart_Item{
	created:Date | null;
	id:number;
	item_id:number;
	qty:number;
	session_id:string | null;
	type:'IN_CART'|'BUY_LATER';
	updated:Date | null;
	user_id:number | null;
}
export interface Cash_Close{
	created:Date | null;
	created_by_user_id:number;
	end:string;
	id:number;
	since:Date | null;
	start:string;
	updated:Date | null;
}
export interface Category{
	code:string | null;
	created:Date | null;
	created_by_user_id:number | null;
	default_clave_prod_serv:string | null;
	display_status:'NORMAL'|'HIDDEN';
	id:number;
	image_id:number | null;
	name:string;
	type:string | null;
	updated:Date | null;
	updated_by_user_id:number | null;
}
export interface Category_Type{
	TYPE:'PRODUCT_FOR_SALE'|'TOOL'|'RAW_MATERIAL';
	id:string;
}
export interface Commanda{
	commanda_type_id:number;
	id:number;
	name:string;
	store_id:number;
}
export interface Commanda_Type{
	created:Date | null;
	id:number;
	name:string;
	updated:Date | null;
}
export interface Currency{
	id:string;
	name:string;
}
export interface Currency_Rate{
	currency_id:string;
	id:number;
	rate:number;
	store_id:number;
}
export interface File_Type{
	content_type:string;
	created:Date | null;
	extension:string | null;
	id:number;
	image_id:number | null;
	is_image:'NO'|'YES';
	name:string;
	updated:Date | null;
}
export interface Fund{
	amount:number;
	cashier_hour:string;
	created:Date | null;
	created_by_user_id:number;
	currency_id:string;
	id:number;
	updated:Date | null;
}
export interface Image{
	content_type:string;
	created:Date | null;
	filename:string;
	height:number;
	id:number;
	is_private:number;
	original_filename:string | null;
	size:number;
	uploader_user_id:number | null;
	width:number;
}
export interface Item{
	availability_type:'ON_STOCK'|'BY_ORDER'|'ALWAYS';
	brand_id:number | null;
	category_id:number | null;
	clave_sat:string | null;
	code:string | null;
	commanda_type_id:number | null;
	created:Date | null;
	created_by_user_id:number | null;
	description:string | null;
	extra_name:string | null;
	id:number;
	image_id:number | null;
	measurement_unit:string | null;
	name:string;
	note_required:'NO'|'YES';
	on_sale:'NO'|'YES';
	product_id:number | null;
	provider_user_id:number | null;
	reference_price:number;
	status:'ACTIVE'|'DELETED';
	unidad_medida_sat_id:string | null;
	updated:Date | null;
	updated_by_user_id:number | null;
}
export interface Item_Attribute{
	id:number;
	item_id:number;
	name:string;
	value:string;
}
export interface Item_Exception{
	created:Date | null;
	description:string;
	id:number;
	item_id:number;
	updated:Date | null;
}
export interface Item_Option{
	id:number;
	included_extra_qty:number;
	included_options:number | null;
	item_id:number;
	max_extra_qty:number | null;
	max_options:number | null;
	name:string;
	status:'ACTIVE'|'DELETED';
}
export interface Item_Option_Value{
	charge_type:'OPTIONAL'|'INCLUDED'|'EXTRA_CHARGE';
	extra_price:number;
	id:number;
	item_id:number;
	item_option_id:number | null;
	max_extra_qty:number;
	portion_amount:number;
	price:number;
	status:'ACTIVE'|'DELETED';
}
export interface Item_Recipe{
	created:Date | null;
	id:number;
	item_id:number;
	parent_item_id:number;
	portion_qty:number;
	print_on_recipe:'NO'|'YES';
	updated:Date | null;
}
export interface Keyboard_Shortcut{
	created:Date | null;
	created_by_user_id:number | null;
	id:number;
	key_combination:string;
	name:string;
	updated:Date | null;
	updated_by_user_id:number | null;
}
export interface Merma{
	box_id:number | null;
	created:Date | null;
	created_by_user_id:number;
	id:number;
	item_id:number;
	note:string | null;
	price:number;
	qty:number;
	shipping_id:number | null;
	store_id:number;
	updated:Date | null;
}
export interface Notification_Token{
	created:Date | null;
	id:number;
	provider:string;
	status:'ACTIVE'|'DELETED';
	token:string;
	updated:Date | null;
	user_id:number;
}
export interface Order{
	address:string | null;
	amount_paid:number;
	ares:number;
	authorized_by:string | null;
	billing_address_id:number | null;
	billing_data_id:number | null;
	cashier_user_id:number | null;
	city:string | null;
	client_name:string | null;
	client_user_id:number | null;
	created:Date | null;
	currency_id:string;
	delivery_status:'PENDING'|'SENT'|'DELIVERED'|'CANCELLED'|'READY_TO_PICKUP';
	delivery_user_id:number | null;
	discount:number;
	facturacion_code:string;
	facturado:'NO'|'YES';
	guests:number;
	id:number;
	lat:number | null;
	lng:number | null;
	marked_for_billing:'YES'|'NO';
	note:string | null;
	paid_status:'PENDING'|'PAID'|'PARTIALLY_PAID';
	paid_timetamp:Date | null;
	price_type_id:number;
	quote_id:number | null;
	sat_codigo_postal:string | null;
	sat_forma_pago:string;
	sat_pdf_attachment_id:number | null;
	sat_razon_social:string | null;
	sat_receptor_email:string | null;
	sat_receptor_rfc:string | null;
	sat_serie:string | null;
	sat_uso_cfdi:string | null;
	sat_xml_attachment_id:number | null;
	service_type:'TOGO'|'IN_PLACE'|'PICK_UP'|'QUICK_SALE';
	shipping_address_id:number | null;
	shipping_cost:number;
	state:string | null;
	status:'PENDING'|'CANCELLED'|'ACTIVE'|'CLOSED';
	store_consecutive:number;
	store_id:number;
	subtotal:number;
	suburb:string | null;
	sync_id:string | null;
	system_activated:Date | null;
	tag:string | null;
	tax:number;
	tax_percent:number;
	total:number;
	updated:Date | null;
}
export interface Order_Item{
	commanda_id:number | null;
	commanda_status:'NOT_DISPLAYED'|'PENDING'|'DISMISSED';
	created:Date | null;
	created_by_user_id:number | null;
	delivered_qty:number;
	delivery_status:'PENDING'|'DELIVERED';
	discount:number;
	exceptions:string | null;
	id:number;
	id_payment:number | null;
	is_free_of_charge:'NO'|'YES';
	is_item_extra:'NO'|'YES';
	item_extra_id:number | null;
	item_group:number | null;
	item_id:number;
	item_option_id:number | null;
	item_option_qty:number;
	note:string | null;
	order_id:number;
	original_unitary_price:number;
	paid_qty:number;
	preparation_status:'PENDING'|'IN_PREPARATION'|'READY'|'DELIVERED';
	price_id:number | null;
	qty:number;
	return_required:'NO'|'YES';
	status:'ACTIVE'|'DELETED';
	stock_status:'IN_STOCK'|'STOCK_REMOVED';
	subtotal:number;
	system_preparation_ended:Date | null;
	system_preparation_started:Date | null;
	tax:number;
	tax_included:'NO'|'YES';
	total:number;
	unitary_price:number;
	updated:Date | null;
	updated_by_user_id:number | null;
}
export interface Pallet{
	created:Date | null;
	created_by_user_id:number | null;
	id:number;
	production_item_id:number | null;
	store_id:number | null;
	updated:Date | null;
}
export interface Pallet_Content{
	box_id:number;
	created:Date | null;
	created_by_user_id:number | null;
	id:number;
	pallet_id:number;
	status:'ACTIVE'|'REMOVED';
	updated:Date | null;
	updated_by_user_id:number | null;
}
export interface Payment{
	change_amount:number;
	concept:string | null;
	created:Date | null;
	created_by_user_id:number | null;
	currency_id:string;
	exchange_rate:number;
	id:number;
	paid_by_user_id:number | null;
	payment_amount:number;
	received_amount:number;
	status:'ACTIVE'|'DELETED';
	store_id:number | null;
	sync_id:string | null;
	tag:string | null;
	type:'income'|'expense';
	updated:Date | null;
}
export interface Paypal_Access_Token{
	access_token:string;
	created:Date | null;
	expires:Date | null;
	id:number;
	raw_response:string | null;
}
export interface Paypal_Order{
	buyer_user_id:number;
	create_response:string;
	created:Date | null;
	id:string;
	log:string | null;
	order_id:number | null;
	status:string;
}
export interface Preferences{
	background_image_id:number | null;
	background_image_size:'repeat'|'cover';
	btn_primary_bg_color:string;
	btn_primary_bg_color_hover:string | null;
	btn_primary_border_color:string | null;
	btn_primary_border_color_hover:string;
	btn_primary_border_width:number;
	btn_primary_text_color:string | null;
	btn_primary_text_color_hover:string | null;
	btn_secondary_bg_color:string | null;
	btn_secondary_bg_color_hover:string | null;
	btn_secondary_border_color:string | null;
	btn_secondary_border_color_hover:string | null;
	btn_secondary_border_width:number;
	btn_secondary_text_color:string | null;
	btn_secondary_text_color_hover:string | null;
	button_border_radius:string;
	button_style:string | null;
	card_background_color:string | null;
	card_background_image_id:number | null;
	card_background_opacity:number;
	card_border_color:string | null;
	card_border_radius:string;
	chat_upload_attachment_image_id:number | null;
	chat_upload_image_id:number | null;
	created:Date | null;
	currency_price_preference:'ONLY_DEFAULT_CURRENCY'|'MULTIPLE_CURRENCY';
	default_file_logo_image_id:number | null;
	default_input_type:'TACTILE'|'KEYBOARD';
	default_price_type_id:number | null;
	default_product_image_id:number | null;
	default_ticket_image_id:number | null;
	default_user_logo_image_id:number | null;
	display_categories_on_items:'YES'|'NO';
	header_background_color:string | null;
	header_text_color:string | null;
	id:number;
	item_selected_background_color:string;
	item_selected_text_color:string;
	link_color:string;
	login_background_image_id:number | null;
	login_background_image_size:'repeat'|'cover';
	login_image_id:number | null;
	logo_image_id:number | null;
	menu_background_color:string;
	menu_background_image_id:number | null;
	menu_background_image_size:'cover'|'repeat';
	menu_background_type:'IMAGE'|'COLOR';
	menu_color_opacity:number;
	menu_icon_color:string;
	menu_text_color:string;
	menu_title_color:string;
	name:string;
	pv_bar_background_color:string;
	pv_bar_text_color:string;
	pv_bar_total_color:string;
	radius_style:string | null;
	submenu_background_color:string;
	submenu_color_opacity:number;
	submenu_icon_color:string;
	submenu_text_color:string;
	text_color:string;
	titles_color:string | null;
	updated:Date | null;
}
export interface Price{
	created:Date | null;
	created_by_user_id:number | null;
	currency_id:string;
	id:number;
	item_id:number;
	price:number;
	price_list_id:number;
	price_type_id:number;
	tax_included:'NO'|'YES';
	updated:Date | null;
	updated_by_user_id:number | null;
}
export interface Price_List{
	created:Date | null;
	created_by_user_id:number | null;
	id:number;
	name:string;
	updated:Date | null;
	updated_by_user_id:number | null;
}
export interface Price_Type{
	created:Date | null;
	id:number;
	name:string;
	sort_priority:number;
	updated:Date | null;
}
export interface Product{
	id:number;
	name:number;
}
export interface Purchase{
	created:Date | null;
	created_by_user_id:number | null;
	id:number;
	provider_name:string | null;
	provider_user_id:number | null;
	status:'ACTIVE'|'DELETED';
	stock_status:'PENDING'|'ADDED_TO_STOCK'|'SHIPPING_CREATED';
	store_id:number;
	total:number;
	updated:Date | null;
	updated_by_user_id:number | null;
}
export interface Purchase_Detail{
	created:Date | null;
	description:string | null;
	id:number;
	item_id:number;
	purchase_id:number;
	qty:number;
	status:'ACTIVE'|'DELETED';
	stock_status:'PENDING'|'ADDED_TO_STOCK';
	total:number;
	unitary_price:number;
	updated:Date | null;
}
export interface Push_Notification{
	app_path:string | null;
	body:string;
	created:Date | null;
	icon_image_id:number | null;
	id:number;
	link:string | null;
	object_id:string | null;
	object_type:string;
	priority:'normal'|'high';
	push_notification_id:string | null;
	read_status:'PENDING'|'READ';
	response:string | null;
	sent_status:number | null;
	title:string;
	updated:Date | null;
	user_id:number;
}
export interface Quote{
	approved_status:'PENDING'|'SENT'|'DECLINED'|'APPROVED'|'CANCELLED';
	approved_time:string | null;
	attachment_id:number | null;
	client_user_id:number | null;
	created:Date | null;
	created_by_user_id:number;
	email:string;
	id:number;
	name:string;
	phone:string;
	store_id:number;
	sync_id:string;
	tax_percent:number;
	updated:Date | null;
	valid_until:string | null;
}
export interface Quote_Item{
	created:Date | null;
	discount:number;
	discount_percent:number;
	id:number;
	item_id:number;
	original_unitary_price:number;
	provider_price:number;
	qty:number;
	quote_id:number;
	status:'ACTIVE'|'DELETED';
	subtotal:number;
	tax:number;
	tax_included:'YES'|'NO';
	total:number;
	unitary_price:number;
	updated:Date | null;
}
export interface Requisition{
	created:Date | null;
	created_by_user_id:number | null;
	date:string;
	id:number;
	requested_to_store_id:number | null;
	required_by_store_id:number;
	status:'PENDING'|'CANCELLED'|'NOT_APPROVED'|'SHIPPED';
	updated:Date | null;
	updated_by_user_id:number | null;
}
export interface Requisition_Item{
	aproved_status:'NOT_APPROVED'|'APPROVED';
	created:Date | null;
	id:number;
	item_id:number;
	qty:number;
	requisition_id:number;
	status:'ACTIVE'|'DELETED';
	updated:Date | null;
}
export interface Returned_Item{
	created:Date | null;
	id:number;
	item_id:number;
	returned_qty:number;
	returns_id:number;
	total:number;
	updated:Date | null;
}
export interface Returns{
	amount_paid:number;
	cashier_user_id:number;
	client_user_id:number | null;
	code:string;
	created:Date | null;
	id:number;
	note:string | null;
	order_id:number;
	store_id:number;
	total:number;
	updated:Date | null;
}
export interface Sat_Response{
	created:Date | null;
	created_by_user_id:number | null;
	id:number;
	id_order:number;
	request:string | null;
	response:string | null;
	updated:Date | null;
	updated_by_user_id:number | null;
}
export interface Session{
	created:Date | null;
	id:string;
	status:'ACTIVE'|'INACTIVE';
	updated:Date | null;
	user_id:number | null;
}
export interface Shipping{
	created:Date | null;
	created_by_user_id:number | null;
	date:string;
	delivery_datetime:string | null;
	from_store_id:number | null;
	id:number;
	note:string | null;
	purchase_id:number | null;
	received_by_user_id:number | null;
	requisition_id:number | null;
	shipping_company:string;
	shipping_guide:string;
	status:'PENDING'|'DELIVERED'|'SENT';
	to_store_id:number;
	updated:Date | null;
	updated_by_user_id:number | null;
}
export interface Shipping_Item{
	box_id:number | null;
	created:Date | null;
	id:number;
	item_id:number | null;
	pallet_id:number | null;
	qty:number;
	received_qty:number;
	requisition_item_id:number | null;
	shipping_id:number;
	shrinkage_qty:number;
	updated:Date | null;
}
export interface Stock_Record{
	created:Date | null;
	created_by_user_id:number;
	description:string | null;
	id:number;
	item_id:number;
	movement_qty:number;
	movement_type:'POSITIVE'|'NEGATIVE'|'ADJUSTMENT';
	order_item_id:number | null;
	previous_qty:number;
	production_item_id:number | null;
	purchase_detail_id:number | null;
	qty:number;
	serial_number_record_id:number | null;
	shipping_item_id:number | null;
	store_id:number;
	updated:Date | null;
	updated_by_user_id:number;
}
export interface Stocktake{
	created:Date | null;
	created_by_user_id:number | null;
	id:number;
	name:string | null;
	status:'ACTIVE'|'CLOSED';
	store_id:number;
	updated:Date | null;
	updated_by_user_id:number | null;
}
export interface Stocktake_Item{
	box_content_id:number | null;
	box_id:number | null;
	created:Date | null;
	created_by_user_id:number | null;
	creation_qty:number | null;
	current_qty:number;
	id:number;
	item_id:number | null;
	pallet_id:number | null;
	stocktake_id:number;
	updated:Date | null;
	updated_by_user_id:number | null;
}
export interface Stocktake_Scan{
	box_content_id:number | null;
	box_id:number | null;
	created:Date | null;
	created_by_user_id:number | null;
	id:number;
	item_id:number | null;
	pallet_id:number | null;
	qty:number;
	stocktake_id:number;
	updated:Date | null;
	updated_by_user_id:number | null;
}
export interface Storage{
	created:Date | null;
	created_by_user_id:number | null;
	id:number;
	section:string;
	shelf:string;
	sort_order:number;
	store_id:number;
	updated:Date | null;
	updated_by_user_id:number | null;
}
export interface Storage_Item{
	created:Date | null;
	created_by_user_id:number | null;
	id:number;
	item_id:number;
	storage_id:number;
	updated:Date | null;
	updated_by_user_id:number | null;
}
export interface Store{
	address:string | null;
	business_name:string | null;
	city:string | null;
	client_user_id:number | null;
	created:Date | null;
	created_by_user_id:number | null;
	default_billing_data_id:number | null;
	default_currency_id:string;
	default_sat_serie:string;
	electronic_transfer_percent_fee:number;
	exchange_rate:number;
	id:number;
	image_id:number | null;
	name:string;
	paypal_email:string | null;
	phone:string | null;
	price_list_id:number | null;
	printer_ticket_config:string | null;
	rfc:string | null;
	state:string | null;
	status:'ACTIVE'|'DISABLED';
	tax_percent:number;
	ticket_footer_text:string | null;
	ticket_image_id:number | null;
	updated:Date | null;
	updated_by_user_id:number | null;
	zipcode:string | null;
}
export interface Store_Bank_Account{
	bank_account_id:number;
	created:Date | null;
	id:number;
	name:string;
	store_id:number;
	updated:Date | null;
}
export interface Unidad_Medida_Sat{
	descripcion:string | null;
	id:string;
	nombre:string;
}
export interface User{
	created:Date | null;
	created_by_user_id:number | null;
	credit_days:number;
	credit_limit:number;
	default_billing_address_id:number | null;
	default_shipping_address_id:number | null;
	email:string | null;
	id:number;
	image_id:number | null;
	lat:number | null;
	lng:number | null;
	name:string;
	password:string | null;
	phone:string | null;
	platform_client_id:number | null;
	price_type_id:number;
	store_id:number | null;
	type:'CLIENT'|'USER';
	updated:Date | null;
	updated_by_user_id:number | null;
	username:string | null;
}
export interface User_Permission{
	add_bills:number;
	add_commandas:number;
	add_items:number;
	add_marbetes:number;
	add_payments:number;
	add_providers:number;
	add_purchases:number;
	add_requisition:number;
	add_stock:number;
	add_user:number;
	approve_bill_payments:number;
	asign_marbetes:number;
	caldos:number;
	change_client_prices:number;
	created:Date | null;
	created_by_user_id:number | null;
	edit_billing_data:number;
	fullfill_orders:number;
	global_bills:number;
	global_order_delivery:number;
	global_pos:number;
	global_prices:number;
	global_purchases:number;
	global_receive_shipping:number;
	global_requisition:number;
	global_send_shipping:number;
	global_stats:number;
	is_provider:number;
	order_delivery:number;
	pay_bills:number;
	pos:number;
	preferences:number;
	price_types:number;
	production:number;
	purchases:number;
	quotes:number;
	receive_shipping:number;
	send_shipping:number;
	stocktake:number;
	store_prices:number;
	updated:Date | null;
	updated_by_user_id:number | null;
	user_id:number;
	view_commandas:number;
}

