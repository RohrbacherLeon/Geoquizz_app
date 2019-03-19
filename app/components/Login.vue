<template>
	<FlexboxLayout class="page">
		<StackLayout class="form">
			<StackLayout class="input-field" marginBottom="25">
				<TextField class="input" hint="Pseudo"  autocorrect="false" autocapitalizationType="none" v-model="user.pseudo"
					returnKeyType="next" @returnPress="focusPassword" fontSize="18" />
				<StackLayout class="hr-light" />
			</StackLayout>

			<StackLayout class="input-field" marginBottom="25">
				<TextField ref="password" class="input" hint="Mot de passe" secure="true" v-model="user.password" :returnKeyType="isLoggingIn ? 'done' : 'next'"
					@returnPress="focusConfirmPassword" fontSize="18" />
				<StackLayout class="hr-light" />
			</StackLayout>

			<Button text="Transférer" @tap="submit" class="btn btn-primary" />
		</StackLayout>
	</FlexboxLayout>
</template>

<script>
// A stub for a service that authenticates users.
const userService = {
    register(user) {
        return Promise.resolve(user);
    },
    login(user) {
        return Promise.resolve(user);
    },
};

export default {
    data() {
        return {
            isLoggingIn: true,
            user: {
                pseudo: "",
                password: "",
            }
        };
    },
    methods: {

        submit() {
            if (!this.user.pseudo || !this.user.password) {
                this.alert(
                    "Merci d'entrer votre pseudo et votre mot de passe."
                );
                return;
            }
            this.login();
        },

        login() {
            userService
                .login(this.user)
                .then(() => {
                })
                .catch(() => {
                    this.alert("Impossible de vous authentifier.");
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
};
</script>

<style scoped>
	.page {
		align-items: center;
		flex-direction: column;
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

	.btn-primary {
		height: 50;
		margin: 30 5 15 5;
		background-color: #e2574c;
        color: white;
		border-radius: 5;
		font-size: 20;
		font-weight: 600;
	}

	.login-label {
		horizontal-align: center;
		color: #A8A8A8;
		font-size: 16;
	}

	.sign-up-label {
		margin-bottom: 20;
	}

	.bold {
		color: #000000;
	}
</style>
