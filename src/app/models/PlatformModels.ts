
export interface Platform_Address{
	address:string;
	created:Date;
	id:number | null;
	lat:number | null;
	lng:number | null;
	platform_client_id:number | null;
	updated:Date;
}
export interface Platform_Client{
	created:Date;
	email:string | null;
	id:number | null;
	name:string | null;
	password:string | null;
	phone:string | null;
	updated:Date;
}
export interface Platform_Client_Store{
	created:number | null;
	platform_client_id:number | null;
	store_id:number | null;
	updated:number | null;
}
export interface Platform_Session{
	created?:number | null;
	id?:string | null;
	platform_client_id?:number | null;
	updated?:number | null;
}

export interface Platform_Store{
	created:Date;
	email:string | null;
	id:number | null;
	image_id:number | null;
	status: 'ACTIVE' | 'INACTIVE' | 'UNLISTED';
	storename:string | null;
	updated:Date;
	version:number | null;
}

export interface Platform_Domain
{
	id:number;
	domain:string;
	created:Date;
	updated:Date;
	store_id:number;
}
