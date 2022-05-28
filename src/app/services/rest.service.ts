import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of, Subject, forkJoin, from, firstValueFrom, } from 'rxjs';
import {  mergeMap } from 'rxjs/operators';
//import * as XLSX from 'xlsx';
import { map } from 'rxjs/operators';
import { Rest, RestResponse, SearchObject } from './Rest';

import {Utils, ErrorMessage } from '../classes/Utils';
import {DatabaseStore} from '../classes/Finger/DatabaseStore';
//import {Options} from '../classes/Finger/OptionsUtils';
import {Platform_Address, Platform_Client, Platform_Store} from '../models/PlatformModels';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import {
	ShippingInfo, AttachmentInfo, LoginResponse, 
	BillInfo, PurchaseInfo, MermaInfo, OrderItemInfo,
	Order_Report, PlatformStoreInfo, FacturacionRequest, CategoryInfo,
	UserBalance, ReturnsInfo, StocktakeInfo, 
	CashCloseInfo, PaymentInfo, OrderInfo, ItemStockInfo,
	ItemInfo, BankMovementInfo, SocketMessage, RequisitionInfo,
	OFFLINE_DB_SCHEMA,
	ProductoOServicio,
	QuoteInfo,
	StockRecordInfo
} from '../models/models';

import {
	Address, Bank_Account, Bank_Movement, Bill, Billing_Data, Cash_Close,
	Category, Commanda, Commanda_Type, Fund, Item,Image, Merma,
	Notification_Token, Order, Order_Item, Payment, Preferences,
	Price, Price_List, Price_Type, Purchase, Push_Notification, Returns,
	Shipping, Stocktake, Stocktake_Scan, Stock_Record, Storage_Item, Storage,
	Store, Unidad_Medida_Sat, User,User_Permission, Requisition, Quote, Quote_Item, Currency, Currency_Rate
} from '../models/RestModels';
//import {OfflineUtils} from '../classes/OfflineUtils';
//import {environment} from 'src/environments/environment';

//import Dexie from '@dpogue/dexie';

type SuperEmpty<Type> = Type | null | undefined;

export const USER_PERMISSION_KEY = 'user_permission';
const USER_KEY = 'user';

export interface SearchResume
{
	total?:number;
	sum?:number;
	min?:number;
	max?:number;
	remaining?:number;
}


@Injectable({
	providedIn: 'root'
})
export class RestService {
	public domain_configuration = {
		domain: window.location.protocol+'//'+window.location.hostname
	};

	private platform_domain_configuration = {
		domain: this.getPlatformDomain()
	};

	public is_offline:boolean = false;
	public local_db:any;

	public path:string = 'PointOfSale';
	public errorBehaviorSubject: BehaviorSubject<ErrorMessage>;
	public errorObservable: Observable<ErrorMessage>;
	public urlBase: string = this.getUrlBase();
	public url_platform:string = this.getUrlPlatform();
	public printer_ticket_config:string = '';

	private updatesSubject = new Subject<SocketMessage>();
	public updates:Observable<SocketMessage>;

	private client_selected_store_id:number | null = null;
	public current_user:User | null = null;
	public current_platform_client:Platform_Client | null = null;

	public current_platform_domain:string | null = null;
	public can_change_domain:boolean = true;

	public session_start?:Date | null;
	public current_permission:Partial<User_Permission>  = {};
	public local_preferences:Preferences = this.getPreferencesFromSession();

	private finger_db: DatabaseStore	= DatabaseStore.builder('cart',1,{order_item_info:"created"});
	private offline_db: DatabaseStore	= DatabaseStore.builder
	(
		OFFLINE_DB_SCHEMA.name,
		OFFLINE_DB_SCHEMA.version,
		OFFLINE_DB_SCHEMA.schema
	);

	public notification = new BehaviorSubject({});
	public is_maps_loaded:boolean = false;
	public show_menu:boolean = false;
	/* Rest variable declarations */
	public item_stock:Rest<Item, ItemStockInfo> = this.initRest('stock_by_item');
	public category_info:Rest<Category,CategoryInfo> = this.initRest('category_info');
	public facturacion_request:Rest<FacturacionRequest,any> = this.initRest('facturacion_request');
	public address:Rest<Address,Address> = this.initRest('address');
	public bank_account:Rest<Bank_Account, Bank_Account> = this.initRest('bank_account');
	public bank_movement_info:Rest<Bank_Movement, BankMovementInfo> = this.initRest('bank_movement_info');
	public bill_info:Rest<Bill, BillInfo> = this.initRest('bill_info');
	public bill:Rest<Bill, Bill> = this.initRest('bill');
	public notification_token:Rest<Notification_Token,Notification_Token> = this.initRest('notification_token');
	public category:Rest<Category,Category> = this.initRest('category');
	public item:Rest<Item,Item> = this.initRest('item');
	public item_info:Rest<Item,ItemInfo>	= this.initRest('item_info');
	public item_stock_info:Rest<Item,ItemStockInfo> = this.initRest('stock_by_item');
	//\
	public push_notification:Rest<Push_Notification,Push_Notification> = this.initRest('push_notification');
//	public order:Rest<Order,Order> = this.initRest('order');
	public order_info:Rest<Order,OrderInfo> = this.initRest('order_info');
	public order_total:Rest<Order,Order> = this.initRest('reportes');
//	public order_item:Rest<Order_Item,Order_Item> = this.initRest('order_item');
	public preferences:Rest<Preferences,Preferences> = this.initRest('preferences');
//	public production_info:Rest<Production,ProductionInfo> = this.initRest('production_info');
//	public production:Rest<Production,Production> = this.initRest('production');
	//public box_info:Rest<Box, BoxInfo> =this.initRest('box_info');
	//public requisition:Rest<Requisition,Requisition> = this.initRest('requisition');
	public shipping:Rest<Shipping,Shipping> = this.initRest('shipping');
	public shipping_info:Rest<Shipping,ShippingInfo> = this.initRest('shipping_info');
//	public pallet_info:Rest<Pallet,PalletInfo> = this.initRest('pallet_info');
	public price:Rest<Price,Price> = this.initRest('price');
	public price_list:Rest<Price_List,Price_List> = this.initRest('price_list');
	public price_type:Rest<Price_Type,Price_Type> = this.initRest('price_type');
	public quote_info:Rest<Quote,QuoteInfo> = this.initRest('quote_info');
	public store:Rest<Store,Store> = this.initRest('store');
	public user_permission:Rest<User_Permission,User_Permission> = this.initRest('user_permission');
	public user:Rest<UserBalance,UserBalance> = this.initRest('user');
	public stocktake:Rest<Stocktake, Stocktake> = this.initRest('stocktake');
	public stocktake_scan:Rest<Stocktake_Scan, Stocktake_Scan> = this.initRest('stocktake_scan');
	//public order_item_fullfillment:Rest<Order_Item_Fullfillment,Order_Item_Fullfillment> = this.initRest('order_item_fullfillment');

	public expense_report:Rest<Bank_Movement, SearchResume> = this.initRest('expense_report');
	public bill_due_amounts:Rest<Bill, Record<string,number>> = this.initRest('billDueDatesAmountsReport');
	public stocktake_info:Rest<Stocktake, StocktakeInfo> = this.initRest('stocktake_info');
	public payment_info:Rest<Payment,PaymentInfo> = this.initRest('payment_info'); //A chingar a su madre
	public order:Rest<Order,Order> = this.initRest('order');
	public cash_close:Rest<Cash_Close,Cash_Close> = this.initRest('cash_close');
	public cash_close_info:Rest<Cash_Close,CashCloseInfo> = this.initRest('cash_close_info');
	public fund:Rest<Fund,Fund> = this.initRest('fund');
	public commanda:Rest<Commanda,Commanda> = this.initRest('commanda');
	public commanda_type:Rest<Commanda_Type,Commanda_Type> = this.initRest('commanda_type');
	public unidad_medida_sat:Rest<Unidad_Medida_Sat,Unidad_Medida_Sat> = this.initRest('unidad_medida_sat');
	public billing_data:Rest<Billing_Data,Billing_Data> = this.initRest('billing_data');
	public purchase_info:Rest<Purchase,PurchaseInfo> = this.initRest('purchase_info');
	public storage:Rest<Storage,Storage> = this.initRest('storage');
	public storage_item:Rest<Storage_Item,Storage_Item> = this.initRest('storage_item');
	public merma_info:Rest<Merma,MermaInfo> = this.initRest('merma_info');
	public order_report:Rest<Order_Report,Order_Report> = this.initRest('order_report');
	public platform_address:Rest<Platform_Address,Platform_Address> = this.initRestPlatform('address');
	public platform_client:Rest<Platform_Client,Platform_Client> = this.initRestPlatform('platform_client');
	public platform_store_info:Rest<Platform_Store,PlatformStoreInfo> = this.initRestPlatform('store_info');
	public returns_info:Rest<Returns,ReturnsInfo> = this.initRest('returns_info');
	public requisition_info:Rest<Requisition,RequisitionInfo> = this.initRest('requisition_info');
	public producto_servicio_sat:Rest<ProductoOServicio,ProductoOServicio> = this.initRest('producto_servicio_sat');
	public currency:Rest<Currency,Currency> = this.initRest('currency');
	public currency_rate:Rest<Currency_Rate,Currency_Rate> = this.initRest('currency_rate');
	public stock_record_info:Rest<Stock_Record,StockRecordInfo> = this.initRest('stock_record_info');

	//public platform_client_stores:Rest<Platform_Client_Store,Platform_Client_Store> = this.initRestPlatform('platform_client_stores');

	constructor(private http: HttpClient,/*private angularFireMessaging:AngularFireMessaging,*/private dom_sanitizer:DomSanitizer)
	{
		this.errorBehaviorSubject = new BehaviorSubject<ErrorMessage>(new ErrorMessage('',''));
		this.errorObservable = this.errorBehaviorSubject.asObservable();
		this.updates	= this.updatesSubject.asObservable();

		this.session_start = this.getSessionStart();

		let platform_store_info = localStorage.getItem('platform_store_info');
		if( platform_store_info )
		{
			let st:PlatformStoreInfo = JSON.parse(platform_store_info) as PlatformStoreInfo;
			let protocol = window.location.protocol;

			this.domain_configuration.domain = protocol + '//' + st.domains[0].domain;
			setTimeout(()=>{
				this.sendNotification('domain', st.domains[0].domain );
			},1000)

			setTimeout(()=>{
				this.sendNotification('domain', st.domains[0].domain );
			},5000)
		}

		this.current_user = this.getUserFromSession();

		window.addEventListener('error', function(error){
			console.error('Error',error);
		});

		//this.angularFireMessaging.messages.subscribe((message)=>
		//{
		//	if( this.current_user )
		//	{
		//		this.user_permission.get( this.current_user.id )
		//		.subscribe((response)=>
		//		{
		//			console.log('Updating permissions');
		//			if( response !== null )
		//			{
		//				this.current_permission = response;
		//			}
		//			else
		//			{
		//				this.current_permission = response;
		//			}

		//		});
		//	}

		//	this.notification.next(message);
		//})


		this.finger_db.init().then(()=>{console.log('finger db intilized')});
		this.offline_db.init().then(()=>{console.log('offline intilized')});
	}
	sendNotification(type:string, id:string|number)
	{
		//if( this.socket )
		//	this.socket.emit('update',{type,id});
		////this.update('update', {type,id});
	}
	getSessionStart():Date
	{
		let session = localStorage.getItem('session');

		if( session )
		{
			let obj = JSON.parse(session);
			let date = Date.parse(obj.created);
			let d = new Date();
			d.setTime(date);
			return d;
		}

		return new Date();
	}

	setDomainChangeSettings()
	{
		let root_domains:string[] = ['127.0.0.1','clientes.integranet.xyz','pos.integranet.xyz'];
		this.can_change_domain = root_domains.includes(window.location.hostname);
	}

	getPlatformDomain():string
	{
		if (window.location.hostname.indexOf('127.0.') == 0 || window.location.hostname.indexOf('192.168') == 0 )
			return 'http://127.0.0.1';

		if (window.location.hostname.indexOf('localhost') == 0)
			return 'http://127.0.0.1';

		return 'https://clientes.integranet.xyz';
	}

	getUrlPlatform():string
	{
		this.setDomainChangeSettings();

		if ( window.location.hostname.indexOf('integranet.xyz') !== -1)
			return 'api';

		if (window.location.hostname.indexOf('127.0.') == 0 || window.location.hostname.indexOf('192.168') == 0 )
			return 'POSSignUP';

		if (window.location.hostname.indexOf('localhost') == 0)
			return 'POSSignUP';


		return 'api';
	}

	getUrlBase():string
	{
		this.setDomainChangeSettings();

		if ( window.location.hostname.indexOf('integranet.xyz') !== -1)
			return 'api';

		if (window.location.hostname.indexOf('127.0.') == 0 || window.location.hostname.indexOf('192.168') == 0 )
			return ''+this.path;

		if (window.location.hostname.indexOf('localhost') == 0)
			return ''+this.path;

		return 'api';
	}

	public initRestPlatform<T,U>(path:string)
	{
		return new Rest<T,U>(this.platform_domain_configuration,`${this.url_platform}/${path}.php`, this.http);
	}

	public initRest<T, U>(path: string)
	{
		return new Rest<T, U>(this.domain_configuration,`${this.urlBase}/${path}.php`, this.http);
	}

	getSessionHeaders()
	{
		if( localStorage.getItem('session_token') == null )
		{
			return new HttpHeaders();
		}

		let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('session_token'));
		return headers;
	}

	getClientPlatformFromSession():Platform_Client | null
	{
		let usr:string|null = localStorage.getItem('platform_client');

		if( usr )
			return Utils.transformJson( usr );

		return null;
	}

	getUserFromSession():User | null
	{
		let usr:string|null = localStorage.getItem( USER_KEY );
		let permissions:string | null = localStorage.getItem( USER_PERMISSION_KEY );

		if( permissions )
		{
			this.current_permission= JSON.parse( permissions );
		}

		if( usr )
			return Utils.transformJson( usr );

		return null;
	}
	doLoginPlatform(email:string,password:string):Observable<LoginResponse>
	{
		let result = this.http.post<any>(`${this.getPlatformDomain()}/${this.getUrlPlatform()}/login.php`, { email, password}, { withCredentials: true })
			.pipe(map(response =>
			{
				if (response && response.session.id)
				{
					this.current_platform_client = response.platform_client;
					this.current_permission = {};

					localStorage.setItem('platform_client', JSON.stringify(response));
					localStorage.setItem('session_token', response.session.id);
					localStorage.removeItem(USER_PERMISSION_KEY);
					localStorage.removeItem('session');
				}
				return response;
			}));
		return result;

	}

	doLogin(username: string, password: string): Observable<LoginResponse> {
		let result = this.http.post<any>(`${this.domain_configuration.domain}/${this.urlBase}/login.php`, { username, password}, { withCredentials: true })
			.pipe(map(response => {
				if (response && response.session.id) {
					this.current_user = response.user;
					this.current_permission = response.user_permission;

					localStorage.setItem('user', JSON.stringify(response));
					localStorage.setItem('session_token', response.session.id);
					localStorage.setItem(USER_PERMISSION_KEY, JSON.stringify(response.user_permission));
					localStorage.setItem('session', JSON.stringify(response.session));
					this.session_start = this.getSessionStart();
				}
				return response;
			}));
		return result;
	}


	logout()
	{
		let obj = {
			method: 'logout',
		};

		this.http.post<any>
		(
			`${this.domain_configuration.domain}/${this.urlBase}/updates.php`,
			obj,
			{ withCredentials: true, headers: this.getSessionHeaders() }
		)
		.subscribe(()=>
		{
			this.current_user = null;
			localStorage.clear();
			window.location.href='/';

		},(error:any)=>{
			console.log('ocurrio un error al finalizar la sesion',error);
			this.current_user = null;
			localStorage.clear();
			window.location.href='/';
		});
	}

	getFilePath(file_id: number,download=false): string
	{
		let d_string = download ?'&download=1':'';

		return this.domain_configuration.domain+'/'+this.urlBase + '/attachment.php?id=' + file_id+d_string;
	}

	getPlatformImagePath(image1_id:SuperEmpty<number>): string
	{
		if( image1_id )
			return this.platform_domain_configuration.domain+'/'+this.getUrlPlatform()+ '/image.php?id=' + image1_id;

		return '/assets/2px_transparent.png';
	}

	//getUrlSafe(url:string):SafeUrl
	getUrlSafe(url:string):string
	{
		return url;
		//return this.dom_sanitizer.bypassSecurityTrustUrl(url);
	}

	//getImagePath(image1_id:SuperEmpty<number>,image2_id:SuperEmpty<number> = null,image3_id:SuperEmpty<number> = null,image4_id:SuperEmpty<number> = null ,image5_id:SuperEmpty<number> = null):SafeUrl
	getImagePath(image1_id:SuperEmpty<number>,image2_id:SuperEmpty<number> = null,image3_id:SuperEmpty<number> = null,image4_id:SuperEmpty<number> = null ,image5_id:SuperEmpty<number> = null):string
	{
		if (image1_id)
			return this.getUrlSafe(this.domain_configuration.domain+'/'+this.urlBase + '/image.php?id=' + image1_id);
		//console.log('dos');
		if (image2_id)
			return this.getUrlSafe(this.domain_configuration.domain+'/'+this.urlBase + '/image.php?id=' + image2_id);
		//console.log('tres');
		if (image3_id)
			return  this.getUrlSafe(this.domain_configuration.domain+'/'+this.urlBase + '/image.php?id=' + image3_id);
		//console.log('cuatro');
		if (image4_id)
			return  this.getUrlSafe(this.domain_configuration.domain+'/'+this.urlBase + '/image.php?id=' + image4_id);
		//console.log('cinco');
		if( image5_id )
			return  this.getUrlSafe(this.domain_configuration.domain+'/'+this.urlBase + '/image.php?id=' + image5_id);
		return this.getUrlSafe('/assets/2px_transparent.png');
	}
	getPreferencesFromSession():Preferences
	{
		let preferences:string|null = localStorage.getItem('preferences');
		let user:string | null = localStorage.getItem('user');
		let permissions = localStorage.getItem(USER_PERMISSION_KEY);

		if( permissions )
		{
			this.current_permission = JSON.parse(permissions);
		}

		if( user )
		{
			this.current_user = JSON.parse( user ) as User;
		}

		if( preferences )
		{
			this.local_preferences = JSON.parse( preferences );
			this.applyTheme();
			return this.local_preferences;
		}

		return {
				background_image_id: null,
				background_image_size: 'cover',
				btn_primary_bg_color: '#000000',
				btn_primary_bg_color_hover:null,
				btn_primary_border_color:null,
				btn_primary_border_color_hover:'#000000',
				btn_primary_border_width:1,
				btn_primary_text_color:null,
				btn_primary_text_color_hover:null,
				btn_secondary_bg_color:null,
				btn_secondary_bg_color_hover:null,
				btn_secondary_border_color:null,
				btn_secondary_border_color_hover:null,
				btn_secondary_border_width:1,
				btn_secondary_text_color:null,
				btn_secondary_text_color_hover:null,
				button_border_radius:'0.5em',
				button_style:null,
				card_background_color:null,
				card_background_image_id:null,
				card_background_opacity:60,
				card_border_color:null,
				card_border_radius:'0.5em',
				chat_upload_attachment_image_id:null,
				chat_upload_image_id:null,
				created:new Date(),
				currency_price_preference:'ONLY_DEFAULT_CURRENCY',
				//default_cash_close_receipt: 1,
				//default_ticket_format: 1,
				default_file_logo_image_id:null,
				default_input_type:'TACTILE',
				default_price_type_id:null,
				default_product_image_id:null,
				default_ticket_image_id:null,
				default_user_logo_image_id:null,
				display_categories_on_items:'YES',
				header_background_color:null,
				header_text_color:null,
				id:1,
				item_selected_background_color:'#000000',
				item_selected_text_color:'#FFFFFF',
				link_color:'#000000',
				login_background_image_id:null,
				login_background_image_size:'cover',
				login_image_id:null,
				logo_image_id:null,
				menu_background_color:'#FFFFFF',
				menu_background_image_id:null,
				menu_background_image_size:'cover',
				menu_background_type:'IMAGE',
				menu_color_opacity:60,
				menu_icon_color:'#000000',
				menu_text_color:'#000000',
				menu_title_color:'#000000',
				name:'',
				pv_bar_background_color:'#000000',
				pv_bar_text_color:'#FFFFFF',
				pv_bar_total_color:'#FFFFFF',
				radius_style:null,
				submenu_background_color:'#FFFFFF',
				submenu_color_opacity:80,
				submenu_icon_color:'#000000',
				submenu_text_color:'#000000',
				text_color: '#000000',
				titles_color:null,
				updated:new Date()
		};
	}

	getPreferencesInfo():Promise<Partial<Preferences>>
	{
		console.log('Init preferences');

		return firstValueFrom( this.http.get<RestResponse<Preferences>>(`${this.domain_configuration.domain}/${this.urlBase}/preferences.php?domain=${window.location.hostname}`)
		.pipe
		(
			mergeMap(response=>
			{
				if( response.data.length )
				{
					this.local_preferences = response.data[0];
					this.applyTheme();
					//console.log('Preferencias en getPreferencesInfo');

					localStorage.setItem('preferences', JSON.stringify( this.local_preferences ) );
				}
				else
				{
					this.local_preferences = this.getPreferencesFromSession();
					this.local_preferences.name = '';
					this.local_preferences.menu_background_color = '#FFFFFF';
				}
				return of(this.local_preferences);
			})
		));
	}

	showSuccess(msg:string):void
	{
		this.showErrorMessage(new ErrorMessage(msg, 'alert-success'));
	}

	showError(error: any)
	{
		console.log('Error to display is', error);
		if( error instanceof ErrorMessage )
		{
			this.showErrorMessage(error);
			return;
		}

		let str_error = Utils.getErrorString(error);
		this.showErrorMessage(new ErrorMessage(str_error, 'alert-danger'));
	}

	showErrorMessage(error: ErrorMessage)
	{
		this.errorBehaviorSubject.next(error);
	}

	uploadImage(file:File,is_private:boolean=false):Observable<Image>
	{
		let fd = new FormData();
		fd.append('image', file, file.name);
		fd.append('is_private', is_private ? '1' : '0');
		return this.http.post<Image>(`${this.domain_configuration.domain}/${this.urlBase}/image.php`, fd, { headers: this.getSessionHeaders(), withCredentials: true });
	}

	uploadAttachment(file:File,is_private:boolean=false):Observable<AttachmentInfo>
	{
		let fd = new FormData();
		fd.append('file', file, file.name);
		fd.append('is_private', (is_private ? '1' : '0'));
		return this.http.post<AttachmentInfo>(`${this.domain_configuration.domain}/${this.urlBase}/attachment.php`,fd,{headers:this.getSessionHeaders(),withCredentials:true});
	}

	public hideMenu():void
	{
		this.show_menu = false;
	}

	toggleMenu():void
	{
		this.show_menu = !this.show_menu;
	}

	scrollTop()
	{
		let x = document.querySelector('.page_content>.custom_scrollbar');
		if (x)
			x.scrollTo(0, 0);
	}

	facturar(order_id:number):Observable<string>
	{
		return this.http.get<any>(`${this.domain_configuration.domain}/${this.urlBase}/facturar.php?id=${order_id}`, { headers: this.getSessionHeaders(), withCredentials: true });
	}


	update<T>(method:string,data:any):Observable<T>
	{
		let obj:Record<string,string> = { };

		for(let i in data)
		{
			obj[i] = data[i];
		}
		obj['method'] = method;

		return this.http.post<T>(`${this.domain_configuration.domain}/${this.urlBase}/updates.php`,obj , { withCredentials: true, headers: this.getSessionHeaders() });
	}

	post(url:string,payload:Object):Observable<Object>
	{
		let postUrl:string= this.domain_configuration.domain+'/'+this.urlBase+'/'+url;
		//console.log('Url to post',postUrl);
		return this.http.post(postUrl,JSON.stringify( payload ),{headers:this.getSessionHeaders(),withCredentials:true});
	}
	getUrlAsString(url:string):Observable<string>
	{
		return this.http.get(url, {headers: this.getSessionHeaders(), withCredentials: true , responseType: 'text'});
	}

	applyTheme()
	{

		if( this.local_preferences == null )
			return;

		let properties:Record<string,string> = {
			'--menu-icon-color':this.local_preferences.menu_icon_color || '#F66151',
			'--menu-text-color':this.local_preferences.menu_text_color || '#F66151',
			'--menu-title-color':this.local_preferences.menu_title_color || '#F66151',
			'--submenu-icon-color':this.local_preferences.submenu_icon_color || '#FFFFFF',
			'--submenu-text-color':this.local_preferences.submenu_text_color || '#FFFFFF',
			'--button-border-radius': this.local_preferences.button_border_radius || '.25em',

			'--btn-primary-bg-color': this.local_preferences.btn_primary_bg_color || '#F66151',
			'--btn-primary-bg-color-hover': this.local_preferences.btn_primary_bg_color_hover || '#F66151',
			'--btn-primary-text-color': this.local_preferences.btn_primary_text_color || '#FFFFFF',
			'--btn-primary-text-color-hover': this.local_preferences.btn_primary_text_color_hover || '#FFFFFF',
			'--btn-primary-border-color': this.local_preferences.btn_primary_border_color || '#F66151',
			'--btn-primary-border-color-hover': this.local_preferences.btn_primary_border_color_hover || '#F66151',

			'--btn-secondary-bg-color': this.local_preferences.btn_secondary_bg_color || '#6c757d',
			'--btn-secondary-bg-color-hover': this.local_preferences.btn_secondary_bg_color_hover || '#6c757d',
			'--btn-secondary-text-color': this.local_preferences.btn_secondary_text_color || '#000000',
			'--btn-secondary-text-color-hover': this.local_preferences.btn_secondary_text_color_hover || '#000000',
			'--btn-secondary-border-color': this.local_preferences.btn_secondary_border_color || '##6c757d',
			'--btn-secondary-border-color-hover': this.local_preferences.btn_secondary_border_color_hover || '#6c757d',



			'--header-background-color': this.local_preferences.header_background_color || '#F66151',
			'--header-text-color': this.local_preferences.header_text_color || '#000000',
			'--link-color': this.local_preferences.link_color || '#F66151',
			'--button-style': this.local_preferences.button_style || 'transparent',
			'--titles-color': this.local_preferences.titles_color || '#000000',
			'--card-border-radius': this.local_preferences.card_border_radius || '.25em',
			'--button_border_radius': this.local_preferences.button_border_radius || '.25em',
			'--text-color': this.local_preferences.text_color || '#000000',
			'--icon-menu-color':this.local_preferences.pv_bar_background_color || 'white',
			'--pv-bar-text-color': this.local_preferences.pv_bar_text_color || '#FFFFFF',
			'--pv-bar-background-color': this.local_preferences.pv_bar_background_color || '#000000',
			'--pv-bar-total-color': this.local_preferences.pv_bar_total_color || '#FFFFFF',
			'--item-selected-background-color': this.local_preferences.item_selected_background_color || '#F66151',
			'--item-selected-text-color': this.local_preferences.item_selected_text_color || '#FFFFFF',
		};

		let body = window.document.body;

		for(let i in properties )
		{
			if( properties[ i ] )
			{
				body.style.setProperty( i, properties[i] );
			}
		}

		if( this.local_preferences?.login_background_image_id )
		{
			let path = this.getImagePath(this.local_preferences.login_background_image_id);
			let sanited_path = this.dom_sanitizer.bypassSecurityTrustResourceUrl(path);

			//console.log('sanited_path',	sanited_path);
			//console.log('setting background image',this.getImagePath(this.local_preferences.background_image_id));
			if( this.local_preferences.login_background_image_size  == 'cover')
				body.style.setProperty('--login-background-image','url('+path+') no-repeat fixed center/cover transparent');
			else
				body.style.setProperty('--login-background-image','url('+path+') repeat fixed');
		}

		if( this.local_preferences.background_image_id )
		{
			let path = this.getImagePath(this.local_preferences.background_image_id);

			//if( this.local_preferences.background_image_size == 'cover' )
			//{
			//	body.style.setProperty('--background-image', 'url('+path+') no-repeat fixed center/cover transparent');
			//}
			//else
			//{
			//	body.style.setProperty('--background-image','url('+path+') repeat fixed');
			//}

			if( this.local_preferences.background_image_id )
			{
				if( this.local_preferences.background_image_size == 'cover' )
				{
					body.style.setProperty('--background-image', 'url('+path+') no-repeat fixed center/cover transparent');
				}
				else
				{
					body.style.setProperty('--background-image','url('+path+') repeat fixed');
				}
			}
			else if( this.local_preferences.background_image_size == 'cover' )
			{
				body.style.setProperty('--menu-background-image','url(/assets/default_background.webp) no-repeat fixed center/cover transparent');
			}
			else
			{
				body.style.setProperty('--menu-background-image','url(/assets/default_background.webp) repeat fixed');
			}
		}
		else
		{
			body.style.setProperty('--menu-background-image','url(/assets/default_background.webp) repeat fixed');
		}

		if( this.local_preferences.menu_background_type == 'COLOR' &&  this.local_preferences.menu_background_color)
		{
			let hex = this.local_preferences.menu_background_color.substring(1,8);
			var bigint = parseInt(hex, 16);
			var r = (bigint >> 16) & 255;
			var g = (bigint >> 8) & 255;
			var b = bigint & 255;

			let percent = this.local_preferences.menu_color_opacity/100;

			body.style.setProperty('--menu-background-image','none');
			body.style.setProperty('--menu-background-color','rgba('+r+','+g+','+b+','+percent+')')
		}
		else
		{
			body.style.setProperty('--menu-background-color','transparent');

			if( this.local_preferences.menu_background_image_id )
			{
				if( this.local_preferences.menu_background_image_size == 'cover' )
				{
					body.style.setProperty('--menu-background-image', 'url('+this.getImagePath( this.local_preferences.menu_background_image_id )+') no-repeat fixed center/cover transparent');
				}
				else
				{
					body.style.setProperty('--menu-background-image','url('+this.getImagePath( this.local_preferences.menu_background_image_id )+') repeat fixed');
				}
			}
			else if( this.local_preferences.menu_background_image_size == 'cover' )
			{
				body.style.setProperty('--menu-background-image','url(/assets/default_menu_background.jpg) no-repeat fixed center/cover transparent');
			}
			else
			{
				body.style.setProperty('--menu-background-image','url(/assets/default_menu_background.jpg) repeat fixed');
			}
		}

		if( this.local_preferences.submenu_background_color )
		{
			let hex = this.local_preferences.submenu_background_color.substring(1,8);
			var bigint = parseInt(hex, 16);
			var r = (bigint >> 16) & 255;
			var g = (bigint >> 8) & 255;
			var b = bigint & 255;

			let percent = this.local_preferences.submenu_color_opacity/100;

			body.style.setProperty('--submenu-background-color','rgba('+r+','+g+','+b+','+percent+')')
		}
		else
		{

			body.style.setProperty('--submenu-background-color','#eb5a4e');
		}

		if( this.local_preferences.card_background_image_id )
		{
			body.style.setProperty('--card-background-color','transparent');
		}
		else if( this.local_preferences.card_background_color )
		{
			let hex = this.local_preferences.card_background_color.substring(1,8);
			//console.log('hex is',hex);
			var bigint = parseInt(hex, 16);
			var r = (bigint >> 16) & 255;
			var g = (bigint >> 8) & 255;
			var b = bigint & 255;

			//console.log('rgb is',r,g,b);
			let percent = this.local_preferences.card_background_opacity/100;
			body.style.setProperty('--card-background-color','rgba('+r+','+g+','+b+','+percent+')');
			body.style.setProperty('--card-background-color-plain',this.local_preferences.card_background_color);
			body.style.setProperty('--card-background-image', 'none');
		}
		else
		{
			body.style.setProperty('--card-background-color','#FFFFFF');
			body.style.setProperty('--card-background-color-plain','#FFFFFF');
			body.style.setProperty('--card-background-image', 'none');
		}

		if( this.local_preferences.card_border_color == 'transparent' )
		{
			body.style.setProperty('--card-border-style', 'none');
			body.style.setProperty('--card-border-width', '0');
		}
		else
		{
			body.style.setProperty('--card-border-style', 'solid');
			body.style.setProperty('--card-border-width', '1px');
			body.style.setProperty('--card-border-color', this.local_preferences.card_border_color);
		}



	}
	roundTo4(number:number)
	{
		return Math.floor(number*1000)/1000;
	}

	normalizarOrderItems(order_item_info_list:OrderItemInfo[])
	{
		let temp_list = order_item_info_list.map(i=>i);
		let final_list:OrderItemInfo[] = [];

		temp_list.sort((a,b)=>
		{
			let aa= !!a.order_item.item_option_id;
			let bb= !!b.order_item.item_option_id;

			if( aa == bb )
				return 0;

			return aa ? -1 : 1;
		});

		while( temp_list.length )
		{
			let item_info = temp_list.pop() as OrderItemInfo;
			let subitems = temp_list.filter((i)=>i.order_item.item_group == item_info.order_item.item_group);
			final_list.push( item_info );
			subitems.forEach((a)=>
			{
				let index = temp_list.indexOf(a);
				temp_list.splice(index,1);
				a.order_item.qty = a.order_item.item_option_qty*item_info.order_item.qty;
				final_list.push( a );
			});
		}
		return final_list;
	}
	getLoginLogo():string
	{
		if( window.location.hostname.indexOf('pos.integranet.xyz') !== -1)
			return this.getUrlSafe('/assets/integranet_logo.jpg');

		return this.getImagePath(this.local_preferences.login_image_id, this.local_preferences.logo_image_id );
	}
	createStructuredItems(order_info:OrderInfo)
	{
		let ois:OrderItemStructureInfo[] = [];

		order_info.items.forEach((oii:OrderItemInfo,index:number)=>
		{
			if( ois.length == 0 ||  order_info.items[index-1].order_item.item_group != oii.order_item.item_group )
			{
				ois.push({...oii,childs:[]})
			}
			else
			{
				ois[ois.length-1].childs.push(oii);
			}
		});

		order_info.structured_items = ois;
	}
	setQuoteItemPrice(ii:Order_Item | Quote_Item, price: Price, store:Store, rates:Currency_Rate[]):boolean
	{
		return this.setOrderItemPrice(ii, price, store, rates);
	}

	setOrderItemPrice(ii:Order_Item | Quote_Item, price: Price, store:Store, rates:Currency_Rate[]):boolean
	{
		if( price.currency_id == store.default_currency_id )
		{
			ii.original_unitary_price = price.price;
			return true;
		}

		let cr:Currency_Rate | undefined = rates.find( (r)=> r.currency_id == price.currency_id );

		if(!cr )
		{
			this.showError('No se encontro el tipo de cambio para la moneda ' + price.currency_id);
			return false;
		}

		ii.original_unitary_price = price.price * cr.rate;
		return true;
	}

}
