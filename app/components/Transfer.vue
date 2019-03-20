<template>
	<StackLayout v-if="!is_loading">
		<Label text="Envoyer vos photos vers :"/>
		<Button text="Espace utilisateur" @tap="toggleShowLogin" />
		<StackLayout v-show="show_login" class="form">
			<StackLayout class="input-field" marginBottom="25">
				<TextField class="input" hint="Pseudo"  autocorrect="false" autocapitalizationType="none" v-model="user.login"
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
				<TextField v-show="show_new_serie" class="input" hint="Nom de la série"  autocorrect="false" autocapitalizationType="none" v-model="new_serie_name" fontSize="18" />
				<Button v-show="show_new_serie" text="Transférer" @tap="sendToNewSerie" class="btn btn-primary" />
				<ListPicker v-show="show_series" :items="series" />
				<Button v-show="show_series" text="Transférer" @tap="sendToSerie" class="btn btn-primary" />
			</FlexboxLayout>
		</StackLayout> 
	</StackLayout>
	<StackLayout v-else>
		<Image src="~/assets/images/Logo_small.png" class="loader" width="70" verticalAlignment="center"/>
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
			is_loading: false,
			user: {
				id: "",
                login: "",
                password: ""
            }
		}
	},

	mounted() {
		this.getSeries();
	},
	

	methods:{
		//Afficher / Cacher formulaire login
		toggleShowLogin(){
			this.show_series = false;
			this.show_new_serie = false;
			this.show_login = !this.show_login;
		},

		//Afficher / Cacher formulaire séries existantes
		toggleShowSeries(){
			this.show_login = false;
			this.show_new_serie = false;
			this.show_series = !this.show_series;
		},

		//Afficher / Cacher formulaire nouvelle serie
		toggleShowNewSerie(){
			this.show_login = false;
			this.show_series = false;
			this.show_new_serie = !this.show_new_serie;
		},


		//Envoi des images prisent dans App.vue
		// Params : 
		// uri : chemin de la route ou poster les images
		// index : index de l'image dans le tabelau de App.vue
		// serie_id : id de la serie dans laquelle upload (0 si aucune)
		sendHttpImages(uri, image, serie_id){
			this.is_loading = true;

			// chemin local du fichier image
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
			// parametres d'envoi structurés
			var params = [
				{name:"file", filename: file, mimeType: 'image/jpeg'}
			];
			// task d'envoi selon config + params
			var task = session.multipartUpload(params, request);
			//Si erreur on retourne à l'acceuil
			task.on("error", e => { this.error('Erreur POST ' + e); this.is_loading = false; });
			//si réponse, on ajoute la data  l'image en put
			task.on("responded", e => { 
				let photo = JSON.parse(e.data);
				photo.longitude = image.location.longitude;
				photo.latitude = image.location.latitude;
				photo.serie = {
					id: serie_id
				}
				if(image.user){
					photo.user = this.user;
				}
				let config = {
					headers : {
						'x-token': photo.token
					}
				}//vérifier l'uri
				axios.put(url+uri+photo.id, photo, config).then(response => {
					this.success('Photos ajoutées à la série avec succès!');
					this.is_loading = false;
				}).catch(e => {
					console.log('Erreur PUT ' + e);
					this.is_loading = false;
				});
			});
			
		},
		//Envoyer les photos prisent vers espace user
		sendToUser() {
            if (!this.user.login || !this.user.password) {
                this.alert(
                    "Merci d'entrer votre pseudo et votre mot de passe."
                );
                return;
            } else {
				axios.post(url + "users/signin", this.user).then(response => {
					this.user.id = response.data.id;
					delete this.user.password;
					this.$parent.$options.parent.images.forEach((image) => {
						image.user = this.user;
						this.sendHttpImages('photos/', image, 0);
					});
				});
			}
        },
		//Envoyer les photos prisent vers la série selectionnée dans la liste des séries
		sendToSerie() {
			//On parcours les images prisent dans le parent
			this.$parent.$options.parent.images.forEach((image) => {
				this.sendHttpImages('photos/', image, 2);
			});
        },
		//Envoyer les photos prisent vers une nouvelle série
		sendToNewSerie() {
            if (!this.new_serie_name) {
                this.alert(
                    "Merci d'entrer le nom de votre série."
                );
                return;
            } else {
				let images = this.$parent.$options.parent.images;
				let serie = {
					ville : this.new_serie_name,
					map_long : images[0].location.longitude,
					map_lat : images[0].location.longitude
				}
				axios.post(url + "series", serie).then(response =>{
					images.forEach(img => {
						this.sendHttpImages("photos/", img, response.data.id);
					});
				});
			}
            this.success('Série créée avec succès!');
        },
		//En cas de succès on reset les params de l'appli et on cache le composant
		// Params :
		// message : String à afficher en notif
		success(message){
			this.show_series = false;
			this.show_login = false;
			this.show_new_serie = false;
			this.new_serie_name = '';
			this.$parent.$options.parent.reset_images();
			this.$parent.$options.parent.transfering = false;
			this.$parent.$options.parent.success_message = message;
		},
		//En cas d'erreur on reset les params de l'appli et on cache le composant
		// Params :
		// message : String à afficher en notif
		error(message){
			this.show_series = false;
			this.show_login = false;
			this.show_new_serie = false;
			this.new_serie_name = '';
			this.$parent.$options.parent.transfering = false;
			this.$parent.$options.parent.error_message = message;
		},
		//Recupère les noms des séries existantes
		getSeries(){
			axios.get(url + "series").then((response) => {
				response.data._embedded.series.forEach(serie => {
					this.series.push(serie.ville);
				});
				console.log(this.series)		
			}).catch((error) => {
				console.log(error);
			});
		},
		//Focus sur champ de texte
		focusPassword() {
            this.$refs.password.nativeView.focus();
        },
		//Affiche un message d'alerte
		// Params : 
		// message : message à afficher
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

	.loader {
		margin-top: 100;
		animation: fadeIn 1s infinite alternate;
	}

	@keyframes fadeIn { 
  		from { opacity: 0; } 
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