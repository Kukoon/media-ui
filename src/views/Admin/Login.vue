<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
      <v-col cols="12" md="6">
        <v-card outlined tile>
          <v-card-title class="headline neutral lighten-1">
            Login
          </v-card-title>
          <v-card-text class="pt-6">
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              class="d-flex flex-column justify-end"
            >
              <v-text-field
                color="accent"
                v-model="name"
                :counter="10"
                :rules="nameRules"
                label="Username"
                required
              ></v-text-field>
              <v-text-field
                color="accent"
                v-model="password"
                :rules="passwordRules"
                label="Password"
                required
              ></v-text-field>

              <v-btn
                class="ml-auto"
                :disabled="!valid"
                color="success"
                @click="validate"
              >
                Login
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      dialog: true,
      valid: true,
      name: "",
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
      ],
      password: "",
      passwordRules: [(v) => !!v || "Password is required"],
    };
  },
};
</script>