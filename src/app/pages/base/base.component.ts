import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { Router,ActivatedRoute, ParamMap} from "@angular/router" //,Params
import { Location } from	'@angular/common';
import { Title } from '@angular/platform-browser';
import { SearchObject } from 'src/app/services/Rest';
import { ErrorMessage } from 'src/app/classes/Utils';
import { SubSink } from 'subsink';
import { ConfirmationService } from 'src/app/services/confirmation.service';
import {ShortcutsService} from 'src/app/services/shortcuts.service';

@Component({
	selector: 'app-base',
	templateUrl: './base.component.html',
	styleUrls: ['./base.component.css']
})

export class BaseComponent implements OnInit, OnDestroy {

	public is_loading:boolean	= false;
	//public preferences:Preferences = {};

	public total_pages:number	= 0;
	public total_items: number 	= 0;
	public current_page:number	= 0;
	public pages:number[]		= [];
	public page_size:number		= 50;
	public path:string 			= '';

	public error_message:string | null		= null;
	public success_message:string | null	= null;
	public warning_message:string | null	= null;
	public subs:SubSink	= new SubSink();
	public sort_indicators:Record<string,boolean> = { };

	constructor(public rest: RestService, public confirmation:ConfirmationService,public shortcuts:ShortcutsService, public router: Router, public route: ActivatedRoute, public location: Location, public titleService: Title)
	{
		if( window.document.body.clientWidth < 1200 )
			this.rest.hideMenu();
	}

	ngOnInit() { }

	ngOnDestroy()
	{
		//console.log('destroying');
		this.subs.unsubscribe();
	}

	setPages(current_page:number,totalItems:number)
	{
		this.current_page = current_page;
		this.pages.splice(0,this.pages.length);
		this.total_items = totalItems;

		if( ( this.total_items % this.page_size ) > 0 )
		{
			this.total_pages = Math.floor(this.total_items/this.page_size)+1;
		}
		else
		{
			this.total_pages = this.total_items/this.page_size;
		}

		for(let i=this.current_page-5;i<this.current_page+5;i++)
		{
			if( i >= 0 && i<this.total_pages)
			{
				this.pages.push( i );
			}
		}

		this.is_loading = false;
		//this.rest.scrollTop();
	}

	/*
	simpleSortSearch(parameter:string,item_search:SearchObject<any>)
	{
		let asc:string = parameter+'_ASC';
		let desc:string = parameter+'_DESC';
		to_add:string = null;

		if( desc in this.sort_indicators && this.sort_indicators[desc] )
		{
			this.sort_indicators[desc] = false;
			this.sort_indicators[asc] = true;
			to_add = asc;
			item_search.sort_order.unshift(asc);
		}
		else if( asc in this.sort_indicators && this.sort_indicators[asc])
		{
			this.sort_indicators[asc] = false;
			this.sort_indicators[desc] = true;
		}
		else
		{
			this.sort_indicators[asc] = true;
		}

		if(item_search.sort_order.length>5)
		{
			item_search.sort_order.pop();
		}

		item_search.page = 0;

		this.search(item_search);
	}
	*/

	getSearchExtra(params:ParamMap,extra_keys:string[]):Record<string,string|null>
	{

		if(extra_keys == null )
			return {};

		let search_extra:Record<string,string|null> = {};

		extra_keys.forEach((i:string)=>
		{
			if( params.has('search_extra.'+i ) )
			{
				search_extra[ i ] = params.get('search_extra.'+i ) === 'null' ? null : params.get('search_extra.'+i);
			}
			else
			{
				search_extra[ i ] = null;
			}
		});

		return search_extra;
	}

	getSearch<T>(param_map:ParamMap, fields:string[],extra_keys:string[]=[]):SearchObject<T>
	{
		let keys:string[] = ['eq','le','lt','ge','gt','csv','lk','nn','start'];
		let item_search:any = this.getEmptySearch();

		extra_keys.forEach((i:string)=>
		{
			if( param_map.has('search_extra.'+i ) )
			{
				item_search.search_extra[ i ] = param_map.get('search_extra.'+i ) === 'null' ? null : param_map.get('search_extra.'+i);
			}
			else
			{
				item_search.search_extra[ i ] = null;
			}
		});

		keys.forEach((k:string)=>
		{
			item_search[k] ={};

			fields.forEach((f:string)=>
			{
				let field = k+"."+f;

				if( param_map.has(field) )
				{
					let value_to_assign = param_map.get( field );
					if( value_to_assign === 'null' )
					{
						item_search[k][ field ] = null
					}
					else if( value_to_assign == null ) 
					{
						item_search[ field ] = null
					}
					else
					{
						if( k == 'csv' )
						{
							let v = param_map.get(field);
							item_search.csv[f] = (''+v).split(',');
						}
						else
						{
							let z	= parseInt(value_to_assign);

							if( /.*_id$/.test( field ) && !Number.isNaN(z) )
							{
								item_search[ k ][ f ] = z;
							}
							else if( field )
							{
								item_search[ k ][ f ] = param_map.get( field );
							}
						}
					}
				}
				else
				{
					item_search[ k ][ f ] = null;
				}
			});
		});

		let page_str:string | null = param_map.get('page');
		item_search.page = page_str ? parseInt( page_str ) as number : 0;
		item_search.limit = this.page_size;

		if( item_search.page == NaN )
			item_search.page = 0;

		return item_search as SearchObject<T>;
	}

	getEmptySearch<T>():SearchObject<T>
	{
		let item_search:SearchObject<T> = {
			eq:{} as T,
			le:{} as T,
			lt:{} as T,
			ge:{} as T,
			gt:{} as T,
			lk:{} as T,
			nn:[] as string[],
			sort_order:[] as string[],
			start:{} as T,
			ends:{} as T,
			csv:{},
			different:{},
			is_null:[],
			search_extra: {} as Record<string,string|null>,
			page:0,
			limit: this.page_size
		};
		return item_search;
	}

	search(item_search:SearchObject<any> | null = null )
	{
		let to_search = item_search == null ? this.getEmptySearch() : item_search;

		let search:Record<string,string|null> = {};

		for(let i in to_search.search_extra )
		{
			if( to_search.search_extra[ i ] && to_search.search_extra[ i ] !== 'null' )
				search['search_extra.'+i] =  ''+to_search.search_extra[ i ];
		}

		if( to_search != null )
		{
			to_search.page = 0;

			let array = ['eq','le','lt','ge','gt','csv','lk','nn','start'];

			let i: keyof typeof to_search;

			for(i in to_search )
			{
				if(array.indexOf( i ) > -1 )
				{
					let ivalue = to_search[i] as any;
					let j: keyof typeof ivalue;

					for(j in ivalue)
						if( ivalue[j] !== null && ivalue[j] !== 'null')
							search[i+'.'+j] = ''+ivalue[j]!;
				}
			}
		}

		this.router.navigateByUrl('/',{skipLocationChange: true}).then(()=>{
			this.router.navigate([this.path],{queryParams: search});
		});
	}

	showSuccess(str:string):void
	{
		this.is_loading = false;
		this.rest.showErrorMessage(new ErrorMessage( str,'alert-success' ));
	}

	showError(error:any):void
	{
		this.is_loading = false;
		this.rest.showError(error);
	}
	showWarning(str:string):void
	{
		this.rest.showErrorMessage(new ErrorMessage( str,'alert-warning' ));
	}

	public setTitle(newTitle: string)
	{
		this.titleService.setTitle(newTitle);
	}
}
