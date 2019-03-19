<template>
	<StackLayout>
		<Label text="Envoyer vos photos vers :"/>
		<Button text="Espace utilisateur" @tap="toggleShowLogin" />
		<StackLayout v-show="show_login" class="form">
			<StackLayout class="input-field" marginBottom="25">
				<TextField class="input" hint="Pseudo"  autocorrect="false" autocapitalizationType="none" v-model="user.pseudo"
					returnKeyType="next" @returnPress="focusPassword" fontSize="18" />
				<StackLayout class="hr-light" />
			</StackLayout>

			<StackLayout class="input-field" marginBottom="25">
				<TextField ref="password" class="input" hint="Mot de passe" secure="true" v-model="user.password" 
					@returnPress="sendToUser" fontSize="18" />
				<StackLayout class="hr-light" />
			</StackLayout>

			<Button text="Transférer" @tap="sendToUser" class="btn btn-primary" />
		</StackLayout>
		<Button text="Nouvelle série" @tap="toggleShowNewSerie" />
		<Button text="Serie existante" @tap="toggleShowSeries" />
		<StackLayout>
			<FlexboxLayout flexDirection="column" >
				<TextField v-show="show_new_serie" class="input" hint="Nom nouvelle série"  autocorrect="false" autocapitalizationType="none" v-model="this.new_serie_name" fontSize="18" />
				<Button v-show="show_new_serie" text="Transférer" @tap="sendToNewSerie" class="btn btn-primary" />
				<ListPicker v-show="show_series" :items="series" />
				<Button v-show="show_series" text="Transférer" @tap="sendToSerie" class="btn btn-primary" />
			</FlexboxLayout>
		</StackLayout> 
	</StackLayout>
</template>

<script>
const url = "http://4c0df541.ngrok.io/";
import axios from 'axios';

export default {
	data() {
		return {
			series: [],
            show_series: false,
			show_login: false,
			show_new_serie: false,
			new_serie_name: '',
			user: {
                pseudo: "",
                password: "",
            }
		}
	},

	mounted() {
		this.getSeries();
	},
	

	methods:{
		toggleShowLogin(){
			this.show_series = false;
			this.show_new_serie = false;
			this.show_login = !this.show_login;
		},

		toggleShowSeries(){
			this.show_login = false;
			this.show_new_serie = false;
			this.show_series = !this.show_series;
		},

		toggleShowNewSerie(){
			this.show_login = false;
			this.show_series = false;
			this.show_new_serie = !this.show_new_serie;
		},

		sendHttpImages(uri){
			this.$parent.$options.parent.images.forEach(image => {
				// file path and url
				var file = image.src._android;
				// upload configuration
				var bghttp = require("nativescript-background-http");
				var session = bghttp.session("image-upload");
				var request = {
					url: url+uri,
					method: "POST",
					headers: {
						'Content-Type': 'multipart/octet-stream',
					},
					description: "Uploading "
				};

				var params = [
					{name:"file", filename: file, mimeType: 'image/jpeg'}
				];
				var task = session.multipartUpload(params, request);
				task.on("error", e => { this.error(e) });	
				task.on("responded", e => { this.putHttpImages(JSON.parse(e.data)) });
			});
		},

		putHttpImages(photo){
			photo.longitude = 49.5;
			photo.latitude = 49.5;
			photo.serie = {
				id: 2
			}
			let config = {
				headers : {
					'x-token': photo.token
				}
			}
			axios.put(url+'photos/'+photo.id, photo, config).then(response => {
    			console.log('done');
  			}).catch(e => console.log(e));
		},

		sendToUser() {
            if (!this.user.pseudo || !this.user.password) {
                this.alert(
                    "Merci d'entrer votre pseudo et votre mot de passe."
                );
                return;
            }
			
			this.sendHttpImages('photos');
			this.success('Photos ajoutées à la série avec succès!');
			
			
        },

		sendToSerie() {
			
			this.success('Photos ajoutées à la série avec succès!');
        },

		sendToNewSerie() {
            if (!this.new_serie_name) {
                this.alert(
                    "Merci d'entrer le nom de votre série."
                );
                return;
            }
            this.success('Série créée avec succès!');
        },

		success(message){
			this.show_series = false;
			this.show_login = false;
			this.show_new_serie = false;
			this.new_serie_name = '';
			this.$parent.$options.parent.reset_images();
			this.$parent.$options.parent.transfering = false;
			this.$parent.$options.parent.success_message = message;
		},

		error(message){
			this.show_series = false;
			this.show_login = false;
			this.show_new_serie = false;
			this.new_serie_name = '';
			this.$parent.$options.parent.transfering = false;
			this.$parent.$options.parent.error_message = message;
		},

		getSeries(){
			axios.get(url + "series").then((response) => {
				console.log(response.data._embedded.series[0]);
				response.data._embedded.series.forEach(serie => {
					this.series.push(serie.ville);
				});
				console.log(this.series)
				
			}).catch((error) => {
				console.log(error);
			});
		},

		focusPassword() {
            this.$refs.password.nativeView.focus();
        },

        alert(message) {
            return alert({
                title: "GeoQuizz",
                okButtonText: "OK",
                message: message
            });
        }
	}
}
</script>

<style scoped>
	.btn-primary {
		height: 50;
		margin: 30 5 15 5;
		background-color: #e2574c;
		color: white;
		border-radius: 5;
		font-size: 20;
		font-weight: 600;
	}

	.form {
		flex-grow: 2;
		vertical-align: middle;
	}

	.logo {
		margin-bottom: 12;
		font-weight: bold;
	}

	.input-field {
		margin-bottom: 25;
	}

	.input {
		font-size: 18;
		placeholder-color: #A8A8A8;
	}

	.input-field .input {
		font-size: 54;
	}


</style>