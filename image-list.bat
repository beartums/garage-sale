 echo export const ITEM_PICS=[ > src/app/itemPics.ts
 
 for /f %%G in ('dir src\assets\items\*.* /B') DO echo 	'%%G',>> src/app/itemPics.ts
 
 echo ] >> src/app/itemPics.ts
 
 