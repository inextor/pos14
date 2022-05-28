import { firstValueFrom, Observable } from 'rxjs';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { Utils} from '../classes/Utils';
import {retry} from 'rxjs/operators';
//import { HttpErrorResponse } from '@angular/common/http';


export interface CsvArray{
	[key: string]: any[];
}

/*
* From perl operators except lk = LIKE
* Several comparison operators impose string contexts upon their operands.
* These are string equality (eq),
* string inequality (ne),
* greater than (gt),
* less than (lt),
* greater than or equal to (ge),
* less than or equal to (le),
*/

export interface SearchObject<T>
{
	page:number;
	limit:number;
	eq:Partial<T>; //Equals to
	gt:Partial<T>; //Great than
	lt:Partial<T>; //Less than
	ge:Partial<T>; //Great or equal than
	different:Partial<T>; //Different than
	le:Partial<T>; //less or equal than
	lk:Partial<T>; //like
	nn:string[]; //Not nulls
	is_null:string[];
	sort_order:string[]; //Sort order like 'updated_ASC','name_DESC' //Etc
	csv:CsvArray;
	start:Partial<T>;
	ends:Partial<T>;
	search_extra:Record<string,string|number|null>
}


export interface RestResponse<T>{
	total:number;
	data:T[];
}

export interface DomainConfiguration
{
	domain:string
}

export class Rest<U,T>{
	private urlBase:string;
	private http:HttpClient;
	private domain_configuration:DomainConfiguration;

	constructor(domain_configuration:DomainConfiguration,urlBase:string,http:HttpClient)
	{
		this.urlBase = urlBase;
		this.http = http;
		this.domain_configuration = domain_configuration;
	}

	private getSessionHeaders():HttpHeaders
	{
		if( localStorage.getItem('session_token') == null )
		{
			return new HttpHeaders();
		}

		let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('session_token'));
		return headers;
	}

	get(id:any):Observable<T>
	{
		let params = new HttpParams();
		params = params.set('id',''+id);
		return this.http.get<T>(`${this.domain_configuration.domain}/${this.urlBase}`,{params,headers:this.getSessionHeaders(),withCredentials:true}).pipe( retry(2) );
	}

	getAsPromise(id:any):Promise<T>
	{
		return firstValueFrom( this.get(id) );
	}

	getAll():Observable<RestResponse<T>>
	{
		let params = new HttpParams();
		params = params.set('limit','9999999999');

		return this.http.get<RestResponse<T>>(`${this.domain_configuration.domain}/${this.urlBase}`,{params,headers:this.getSessionHeaders(),withCredentials:true}).pipe( retry(2) );
	}


	search(searchObj:Partial<SearchObject<U>>):Observable<RestResponse<T>>
	{
		let params = new HttpParams();

		if( searchObj.search_extra )
		{
			for( let i in searchObj.search_extra)
			{
				if( searchObj.search_extra[i] === null || searchObj.search_extra[i] === '' || searchObj.search_extra[i] === undefined )
					continue;

				params = params.set(i,''+searchObj.search_extra[''+i]);
			}
		}
		for(let i in searchObj.eq )
		{
			if( (searchObj.eq[i] && ''+searchObj.eq[i] !== 'null') || typeof searchObj.eq[i] == 'number' )
			{
				params = params.set(i,''+this.getString( searchObj.eq[i], i ) );
			}
		}

		for(let i in searchObj.gt )
			if( searchObj.gt[i] || typeof searchObj.gt[i] == 'number' )
				params = params.set(i+'>',''+this.getString( searchObj.gt[i], i ));

		for(let i in searchObj.lt )
			if( searchObj.lt[i] || typeof searchObj.lt[i] == 'number' )
				params = params.set(i+'<',''+this.getString( searchObj.lt[i], i ) );

		for(let i in searchObj.ge )
			if( searchObj.ge[i] || typeof searchObj.ge[i] == 'number' )
				params = params.set(i+'>~',''+this.getString( searchObj.ge[i], i ) );

		for(let i in searchObj.le )
			if( searchObj.le[i] || typeof searchObj.le[i] == 'number' )
				params = params.set(i+'<~',''+this.getString( searchObj.le[i], i ) );

		for(let i in searchObj.csv )
			if( Array.isArray( searchObj.csv[i] ) && searchObj.csv[i].length > 0 )
				params = params.set(i+',',''+searchObj.csv[i].join(','));

		for(let i in searchObj.different )
			if( searchObj.different[i] || typeof searchObj.different[i] == 'number' )
				params = params.set(i+'!',''+this.getString( searchObj.different[i], i ) );

		for(let i in searchObj.lk )
			if( searchObj.lk[i] )
				params = params.set(i+'~~',''+searchObj.lk[i] );

		for(let i in searchObj.start )
		{
			if( searchObj.start[i] )
				params = params.set(i+'^',''+searchObj.start[i] );
		}

		for(let i in searchObj.ends )
		{
			params = params.set(i+'$',''+searchObj.ends[i] );
		}

		/* Not Nulls Search */
		if( searchObj?.nn?.length )
		{
			params = params.set('_NN',searchObj.nn.join(','));
		}
		/* Nulls Search */
		if( searchObj?.is_null?.length )
		{
			params = params.set('_NULL',searchObj.is_null.join(','));
		}

		if( searchObj.page )
		{
			params = params.set( 'page', ''+searchObj.page );
		}

		if( searchObj.limit )
		{
			params = params.set( 'limit', ''+searchObj.limit );
		}

		if( searchObj.sort_order && searchObj.sort_order )
		{
			params = params.set('_sort',searchObj.sort_order.join(','));
		}

		return this.http.get<RestResponse<T>>(`${this.domain_configuration.domain}/${this.urlBase}`,{params,headers:this.getSessionHeaders(),withCredentials:true}).pipe( retry(2) );
	}

	searchAsPromise(searchObj:Partial<SearchObject<U>>):Promise<RestResponse<T>>
	{
		return firstValueFrom( this.search(searchObj) );
	}

	getString(value:any,key:any = ''):string
	{
		let skey = ''+key;

		if( skey == 'created' || skey == 'updated' )
		{
			if( typeof(value) == 'string' )
			{
				if( /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d$/.test(value) )
				{
					let x:string = value.replace('T',' ')+':00';
					console.log( x );
					let d:Date = Utils.getLocalDateFromMysqlString(x) as Date;
					return Utils.getUTCMysqlStringFromDate(d);
				}
			}
		}

		if( value instanceof Date )
		{
			return Utils.getMysqlStringFromDate( value );
		}
		return value;
	}

	create(obj:any):Observable<T>
	{
		return this.http.post<T>(`${this.domain_configuration.domain}/${this.urlBase}`,obj,{headers:this.getSessionHeaders(),withCredentials:true});
	}

	createAsPromise(obj:Partial<T>):Promise<T>
	{
		return firstValueFrom( this.create(obj) );
	}

	update(obj:any,send_as_json:boolean = true ):Observable<T>
	{
		if( send_as_json )
		{
			let str = JSON.stringify( obj );
			let headers = this.getSessionHeaders().set('Content-Type','application/json');
			return this.http.put<T>(`${this.domain_configuration.domain}/${this.urlBase}`,str,{headers,withCredentials:true});
		}

		return this.http.put<T>(`${this.domain_configuration.domain}/${this.urlBase}`,obj,{headers:this.getSessionHeaders(),withCredentials:true});
	}

	updateAsPromise(obj:Partial<T>):Promise<T>
	{
		return firstValueFrom(this.update(obj));
	}

	batchCreate(obj:Partial<T>[]):Observable<T[]>
	{
		return this.http.post<T[]>(`${this.domain_configuration.domain}/${this.urlBase}`,obj,{headers:this.getSessionHeaders(),withCredentials:true});
	}

	batchUpdate(obj:Partial<T>[]):Observable<T[]>
	{
		return this.http.put<T[]>(`${this.domain_configuration.domain}/${this.urlBase}`,obj,{headers:this.getSessionHeaders(),withCredentials:true});
	}

	batchUpdateJSON(obj:Partial<T>[]):Observable<T[]>
	{
		let str = JSON.stringify( obj );
		let headers = this.getSessionHeaders().set('Content-Type','application/json');

		return this.http.put<T[]>(`${this.domain_configuration.domain}/${this.urlBase}`,str,{headers,withCredentials:true});
	}

	delete(obj:U):Observable<T>
	{
		let params = new HttpParams();

		for(let i in obj)
		{
			params = params.set(i,''+obj[i]);
		}

		return this.http.delete<T>(`${this.domain_configuration.domain}/${this.urlBase}`,{params,headers:this.getSessionHeaders(),withCredentials:true});
	}
}
