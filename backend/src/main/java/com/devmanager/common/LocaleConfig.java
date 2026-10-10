package com.devmanager.common;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;

import java.util.List;
import java.util.Locale;

/**
 * Langue des reponses : choisie par le frontend via l'en-tete Accept-Language.
 * Francais par defaut (et pour toute langue non prise en charge), anglais si demande.
 */
@Configuration
public class LocaleConfig {

	public static final Locale DEFAULT_LOCALE = Locale.FRENCH;

	@Bean
	public LocaleResolver localeResolver() {
		AcceptHeaderLocaleResolver resolver = new AcceptHeaderLocaleResolver();
		resolver.setSupportedLocales(List.of(Locale.FRENCH, Locale.ENGLISH));
		resolver.setDefaultLocale(DEFAULT_LOCALE);
		return resolver;
	}
}
