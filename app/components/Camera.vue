<template>
        <StackLayout>
			<Button text="Take Picture" @tap="takePicture" />
			<Button text="Choose Picture" @tap="selectPicture" />
			<WrapLayout>
				<Image v-for="img in images" v-bind:key="img" :src="img.src" width="75" height="75" />
			</WrapLayout>
        </StackLayout>
</template>

<script>
import * as camera from "nativescript-camera";
import * as imagepicker from "nativescript-imagepicker";

import { Image } from "tns-core-modules/ui/image";

//avec import ça marche pas
var geolocation = require("nativescript-geolocation");

export default {
	data() {
		return {
			images:[]
		}
	},
	methods:{
		selectPicture() {

			let context = imagepicker.create({
				mode: 'multiple' 
			});

			context.authorize()
			.then(function() {
				return context.present();
			})
			.then(selection => {
				selection.forEach(selected => {
					
					console.log(JSON.stringify(selected));

					let img = new Image();
					img.src = selected;
					this.images.push(img);
				});
			}).catch(function (e) {
				console.log('error in selectPicture', e);
			});

		},

		getLocalisation(){

			let localisation = {}

			return new Promise(function(resolve, reject) {

				geolocation.isEnabled().then((isEnabled) => {
					if (!isEnabled) {
						geolocation.enableLocationRequest().then(() => {
							console.log("demande");
							
						},(e) => {
							console.log(e)
						});
					}else{
						let location = geolocation.getCurrentLocation({desiredAccuracy: 3, updateDistance: 10, maximumAge: 20000, timeout: 20000}).then(function(loc) {
								if (loc) {
									localisation.latitude = loc.latitude;
									localisation.longitude = loc.longitude
									resolve(localisation);
		
								}
							}, function(e){
								console.log("Error: " + e.message);
						});
					}
					console.log('fin');
				})
			});
			
		},
		takePicture() {

			this.getLocalisation().then(loc => {
				
				camera.requestPermissions()
				.then(() => {
					camera.takePicture({ width: 300, height: 300, keepAspectRatio: true, saveToGallery:false })
					.then(imageAsset => {
						let img = new Image();
						img.src = imageAsset;
						img.location = loc;
						this.images.push(img);
						console.log(this.images);
						
						console.log(`ive got ${this.images.length} images now at location : ${img.location.latitude}, ${img.location.longitude}` );
					})
					.catch(e => {
						console.log('error:', e);
					});
				})
				.catch(e => {
					console.log('Error requesting permission');
				});
			})
			
			

		}
	}
}
</script>