package com.devmanager.security;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtAuthenticationFilter;

	@Value("${app.frontend-url}")
	private String frontendUrl;

	// Origines supplementaires, separees par des virgules (ex. version web de l'application mobile en developpement)
	@Value("${app.cors.extra-origins:}")
	private String extraOrigins;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				// API sans session : chaque requete porte son jeton JWT, donc pas besoin de CSRF
				.csrf(csrf -> csrf.disable())
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/api/auth/**", "/api/health").permitAll()
						// Images (photos, logos) : publiques, mais a une adresse aleatoire impossible a deviner
						.requestMatchers(HttpMethod.GET, "/api/images/*").permitAll()
						// Page d'erreur interne de Spring : publique, sinon une erreur 400 ou 500 serait masquee en 401
						// (et le frontend deconnecterait l'utilisateur a tort)
						.requestMatchers("/error").permitAll()
						.requestMatchers("/h2-console/**").permitAll()
						.anyRequest().authenticated())
				// Sans jeton valide : 401 au lieu d'une page de connexion
				.exceptionHandling(ex -> ex.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
				// Autorise l'affichage de la console H2 (dev uniquement) dans un cadre
				.headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();
		List<String> origins = new ArrayList<>(List.of(frontendUrl));
		Arrays.stream(extraOrigins.split(",")).map(String::trim).filter(origin -> !origin.isEmpty()).forEach(origins::add);
		config.setAllowedOrigins(origins);
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/api/**", config);
		return source;
	}
}
