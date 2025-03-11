#!/usr/bin/env node

/**
 * Script to convert test.md using pandoc + LaTeX for high-quality PDF output
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Setup paths - use environment variables if available
const inputPath = process.env.MD2PDF_INPUT 
  ? path.resolve(process.env.MD2PDF_INPUT)
  : path.resolve(__dirname, '../../test.md'); // Default to test.md in repo root

const outputPath = process.env.MD2PDF_OUTPUT
  ? path.resolve(process.env.MD2PDF_OUTPUT)
  : path.resolve(__dirname, '../../test.pdf'); // Default to test.pdf in repo root

const texTemplatePath = path.resolve(__dirname, '../src/templates/technical_template.tex'); // Save template in templates dir

// Create a custom LaTeX template optimized for MacTeX
const texTemplate = `
\\documentclass[11pt,a4paper]{article}

% Essential packages for high-quality typesetting with MacTeX
\\usepackage{fontspec}
\\usepackage{microtype}
\\usepackage{geometry}
\\usepackage{xcolor}
\\usepackage{graphicx}
\\usepackage{fancyhdr}
\\usepackage{titlesec}
\\usepackage{tocloft}
\\usepackage{booktabs}
\\usepackage{longtable}
\\usepackage{array}
\\usepackage{tabularx}
\\usepackage{colortbl}
\\usepackage{enumitem}
\\usepackage{listings}
\\usepackage{csquotes}
\\usepackage{polyglossia}
\\usepackage{float}
\\usepackage{pdfpages}
% Removed unicode-math for compatibility
\\usepackage{tcolorbox}
\\usepackage{setspace}
\\usepackage{lastpage}
\\usepackage{textcomp} % For bullet symbols
\\usepackage{fancyvrb} % For code blocks
\\usepackage{framed} % For framed code blocks
\\usepackage{color} % For colored code blocks

% Set languages - Polyglossia is better than babel with XeLaTeX in MacTeX
\\setdefaultlanguage{dutch}
\\setotherlanguage{english}

% Document geometry - more modern margins
\\geometry{a4paper, margin=2cm, includeheadfoot}

% Define modern color palette
\\definecolor{primarycolor}{RGB}{24, 58, 82}     % Dark navy blue
\\definecolor{secondarycolor}{RGB}{71, 149, 215} % Vibrant blue
\\definecolor{accentcolor}{RGB}{71, 149, 215}    % Changed to match secondary blue
\\definecolor{lightblue}{RGB}{240, 247, 255}     % Very light blue for backgrounds
\\definecolor{darkgray}{RGB}{60, 60, 60}         % For body text
\\definecolor{lightgray}{RGB}{245, 245, 245}     % For code backgrounds
\\definecolor{tableheadercolor}{RGB}{240, 245, 250} % For table headers

% Modern font settings using widely available system fonts
\\defaultfontfeatures{Ligatures=TeX}
\\setmainfont[Scale=0.98]{Helvetica Neue} % Modern sans font for body text
\\setsansfont[Scale=1]{Helvetica Neue} % Same for sans
\\setmonofont[Scale=0.85]{Menlo} % Standard monospace

% We'll define tightlist later with more options

% Define arraybackslash if not already defined (needed for tables)
\\providecommand{\\arraybackslash}{\\renewcommand{\\arraystretch}{1.2}}

% Define the real command if missing
\\providecommand{\\real}[1]{#1}

% Extra settings for better font rendering in MacTeX
\\newfontfamily\\headingfont[]{Helvetica Neue Bold}
\\defaultfontfeatures{Mapping=tex-text}

% Hyperref settings - at the end to avoid conflicts
\\usepackage[
  bookmarks=true,
  bookmarksnumbered=true,
  colorlinks=true,
  linkcolor=secondarycolor,
  urlcolor=secondarycolor,
  citecolor=secondarycolor,
  pdftitle={$title$},
  pdfauthor={$author$},
  % Removed pdfdate as it's causing issues
  pdfcreator={XeLaTeX with MacTeX},
  unicode=true,
  breaklinks=true
]{hyperref}

% Modern section formatting for manually numbered headings
\\usepackage{titlesec}

% Completely disable automatic numbering in the document
\\setcounter{secnumdepth}{-1}

% Format sections without automatic numbers since we're using manual ones
\\titleformat{\\section}
  {\\headingfont\\Large\\bfseries\\color{primarycolor}}
  {}{0em}{}

\\titleformat{\\subsection}
  {\\headingfont\\large\\bfseries\\color{secondarycolor}}
  {}{0em}{}

\\titleformat{\\subsubsection}
  {\\headingfont\\normalsize\\bfseries\\color{secondarycolor}}
  {}{0em}{}

% Modern, minimalist headers and footers
\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt} % No header rule for modern look
\\fancyhead[L]{\\textcolor{darkgray}{\\small\\sffamily $title$}}
\\fancyfoot[C]{\\textcolor{darkgray}{\\small\\sffamily Pagina \\thepage\\ van \\pageref{LastPage}}}
\\fancyfoot[R]{\\textcolor{darkgray}{\\small\\sffamily $author$}}

% Enhanced table of contents formatting
\\renewcommand{\\cfttoctitlefont}{\\headingfont\\Large\\bfseries\\color{primarycolor}}
\\renewcommand{\\cftbeforetoctitleskip}{1em}
\\renewcommand{\\cftaftertoctitleskip}{2em}
\\renewcommand{\\cftsecpagefont}{\\sffamily}

% Configure TOC for manually numbered headings
\\setcounter{tocdepth}{3}
\\renewcommand{\\contentsname}{Inhoudsopgave}

% Adjust TOC formatting
\\renewcommand{\\cftdot}{.}
\\renewcommand{\\cftdotsep}{1}

% Format TOC entry fonts 
\\renewcommand{\\cftsecfont}{\\sffamily\\bfseries}
\\renewcommand{\\cftsubsecfont}{\\sffamily}
\\renewcommand{\\cftsubsubsecfont}{\\sffamily}

% Completely disable TOC auto-numbering since we have manual numbers in headings
\\makeatletter
\\renewcommand{\\numberline}[1]{}
\\makeatother

% Remove all indentation and number width since we're using manual numbers
\\renewcommand{\\cftsecindent}{0em}
\\renewcommand{\\cftsubsecindent}{1em}
\\renewcommand{\\cftsubsubsecindent}{2em}
\\renewcommand{\\cftsecnumwidth}{0em}
\\renewcommand{\\cftsubsecnumwidth}{0em}
\\renewcommand{\\cftsubsubsecnumwidth}{0em}

% Modern quote box with accent color and rounded corners
\\newenvironment{modernquote}{%
  \\begin{tcolorbox}[
    colback=lightblue,
    colframe=secondarycolor,
    arc=3mm, % Rounded corners
    boxrule=1pt,
    left=10pt,
    right=10pt,
    top=8pt,
    bottom=8pt,
    width=\\linewidth-10pt
    % Removed shadow for compatibility
  ]
  \\itshape
}{%
  \\end{tcolorbox}
}

% Redefine quote environment to use our custom modern box
\\renewenvironment{quote}{\\begin{modernquote}}{\\end{modernquote}}

% Modern table styling
\\renewcommand{\\arraystretch}{1.2}
\\definecolor{tablerowcolor}{RGB}{248, 250, 252}
\\newcommand{\\headrow}{\\rowcolor{tableheadercolor}}

% Enhanced list formatting for better nested lists and proper line breaking
\\setlist{
  itemsep=0.5em, 
  parsep=0.3em, 
  topsep=0.8em,
  leftmargin=*,
  align=left,
  listparindent=0pt,
  labelwidth=*,
  labelsep=0.5em,
  itemindent=0pt
}

% Configure all list levels with proper spacing and no hyphenation
\\setlist[itemize,1]{label=\\textbullet, leftmargin=1.5em}
\\setlist[itemize,2]{label=\\textendash, leftmargin=2.5em}
\\setlist[itemize,3]{label=\\textasteriskcentered, leftmargin=3.5em}
\\setlist[enumerate,1]{label=\\arabic*., ref=\\arabic*, leftmargin=1.5em}
\\setlist[enumerate,2]{label=\\arabic{enumi}.\\arabic*., ref=\\arabic{enumi}.\\arabic*, leftmargin=2.5em}
\\setlist[enumerate,3]{label=\\arabic{enumi}.\\arabic{enumii}.\\arabic*., ref=\\arabic{enumi}.\\arabic{enumii}.\\arabic*, leftmargin=3.5em}

% Disable hyphenation in list items for better readability
\\AtBeginEnvironment{itemize}{\\sloppy\\hyphenpenalty=10000\\exhyphenpenalty=10000}
\\AtBeginEnvironment{enumerate}{\\sloppy\\hyphenpenalty=10000\\exhyphenpenalty=10000}

% Fix for Pandoc's list environments
\\providecommand{\\tightlist}{
  \\setlength{\\itemsep}{0.5em}
  \\setlength{\\parskip}{0.3em}
  \\setlength{\\parsep}{0.3em}
}

% Modern code listings styling
\\lstset{
  basicstyle=\\small\\ttfamily,
  breaklines=true,
  backgroundcolor=\\color{lightgray},
  keywordstyle=\\color{secondarycolor}\\bfseries,
  commentstyle=\\color{darkgray}\\itshape,
  stringstyle=\\color{accentcolor},
  numbers=left,
  numberstyle=\\tiny\\color{darkgray},
  stepnumber=1,
  numbersep=8pt,
  frame=none, % No frame for modern look
  framesep=8pt,
  breakatwhitespace=false,
  showspaces=false,
  showstringspaces=false,
  showtabs=false,
  tabsize=2,
  captionpos=b,
  xleftmargin=15pt
}

% Line spacing - slightly more for better readability
\\setstretch{1.25}

% Simpler solution for code blocks
\\usepackage{minted}
\\definecolor{codebg}{RGB}{245, 245, 245}
\\usemintedstyle{tango}

% Simple definition of the environments we need
\\newenvironment{Shaded}{\\begin{tcolorbox}[colback=codebg,boxrule=0pt,arc=0pt,left=5pt,right=5pt,top=5pt,bottom=5pt]\\footnotesize\\ttfamily}{\\end{tcolorbox}}
\\newenvironment{Highlighting}{}{} 
\\newcommand{\\KeywordTok}[1]{\\textcolor{blue}{\\textbf{#1}}}
\\newcommand{\\DataTypeTok}[1]{\\textcolor{blue}{#1}}
\\newcommand{\\CommentTok}[1]{\\textcolor{darkgray}{\\textit{#1}}}
\\newcommand{\\AttributeTok}[1]{\\textcolor{green}{#1}}
\\newcommand{\\ControlFlowTok}[1]{\\textcolor{blue}{\\textbf{#1}}}
\\newcommand{\\FunctionTok}[1]{#1}
\\newcommand{\\SpecialCharTok}[1]{\\textcolor{cyan}{#1}}
\\newcommand{\\StringTok}[1]{\\textcolor{red}{#1}}
\\newcommand{\\VariableTok}[1]{\\textcolor{orange}{#1}}
\\newcommand{\\OperatorTok}[1]{#1}
\\newcommand{\\NormalTok}[1]{#1}
\\newcommand{\\DecValTok}[1]{\\textcolor{purple}{#1}}
\\newcommand{\\CharTok}[1]{\\textcolor{red}{#1}}
\\newcommand{\\OtherTok}[1]{\\textcolor{green}{#1}}

% More token definitions
\\newcommand{\\ImportTok}[1]{\\textcolor{cyan}{#1}}
\\newcommand{\\InformationTok}[1]{\\textcolor{darkgray}{\\textit{#1}}}
\\newcommand{\\AlertTok}[1]{\\textcolor{red}{\\textbf{#1}}}
\\newcommand{\\ErrorTok}[1]{\\textcolor{red}{\\textbf{#1}}}
\\newcommand{\\BuiltInTok}[1]{\\textcolor{blue}{#1}}
\\newcommand{\\ExtensionTok}[1]{\\textcolor{blue}{#1}}
\\newcommand{\\PreprocessorTok}[1]{\\textcolor{orange}{#1}}
\\newcommand{\\DocumentationTok}[1]{\\textcolor{darkgray}{\\textit{#1}}}
\\newcommand{\\AnnotationTok}[1]{\\textcolor{green}{\\textit{#1}}}
\\newcommand{\\RegionMarkerTok}[1]{\\textcolor{gray}{#1}}
\\newcommand{\\BaseNTok}[1]{\\textcolor{purple}{#1}}
\\newcommand{\\VerbatimStringTok}[1]{\\textcolor{red}{#1}}
\\newcommand{\\NumberTok}[1]{\\textcolor{purple}{#1}}

% Document metadata
\\AtBeginDocument{
  \\hypersetup{
    pdftitle={$title$},
    pdfauthor={$author$},
    pdfsubject={Projectvoorstel},
    pdfkeywords={markov, AI, boekhouding, automatisering}
  }
  
  % Make sure nested lists work properly
  \\raggedbottom
}

% Disable hyphenation in headings and captions
\\newfontfamily\\nohyphens[Ligatures=TeX,HyphenChar=None]{Helvetica Neue}
\\AtBeginEnvironment{quote}{\\hyphenpenalty=10000\\exhyphenpenalty=10000}

% Improve TOC hyphenation
\\makeatletter
\\renewcommand{\\@tocrmarg}{2.55em plus1fil}
\\makeatother

% Begin the document
\\begin{document}
\\hyphenpenalty=1000  % Allow more conservative hyphenation in general
\\exhyphenpenalty=50  % Lower penalty for hyphenating across explicit hyphens
\\sloppy             % Prevent overfull boxes

% Modern title page with clean typography and accent colors
\\begin{titlepage}
  \\begin{center}
    \\vspace*{1cm}
    
    \\begin{tcolorbox}[
      colback=white,
      colframe=primarycolor,
      width=\\textwidth-4cm,
      arc=0mm,
      boxrule=2pt,
      halign=center,
      valign=center,
      height=3cm
    ]
      {\\headingfont\\fontsize{24pt}{26pt}\\selectfont\\color{primarycolor} $title$}
    \\end{tcolorbox}
    
    \\vspace*{1.5cm}
    
    {\\Large\\headingfont\\color{secondarycolor} $author$}
    
    \\vspace*{0.5cm}
    
    {\\large\\sffamily $date$}
    
    \\vfill
    
    % Accent bar - now using secondary blue instead of orange
    \\begin{tcolorbox}[
      colback=secondarycolor,
      colframe=secondarycolor,
      width=4cm,
      height=0.5cm,
      halign=center,
      valign=center,
      arc=0mm,
      boxrule=0pt
    ]
    \\end{tcolorbox}
    
    \\vspace*{1cm}
  \\end{center}
\\end{titlepage}

% Table of contents with modern styling
$if(toc)$
\\tableofcontents
\\thispagestyle{fancy}
\\newpage
$endif$

% Main content
$body$

\\end{document}
`;

// Write template to file
fs.writeFileSync(texTemplatePath, texTemplate);

async function runPandoc() {
  // Construct pandoc command with arguments
  const pandocArgs = [
    inputPath,
    '-o', outputPath,
    '--pdf-engine=xelatex',  // XeTeX is included in MacTeX and handles Unicode and fonts better
    '--template', texTemplatePath,
    '--toc',
    // '--number-sections',  // Comment out automatic section numbering
    '--highlight-style=tango',  // Better contrast with MacTeX default fonts
    '--variable', 'mainfont=Helvetica Neue',  // Updated to match our template
    '--variable', 'sansfont=Helvetica Neue',  
    '--variable', 'monofont=Menlo', 
    '--variable', 'lang=nl',  // Language code for Dutch in MacTeX
    '--variable', 'geometry=margin=2cm,a4paper', // Match our template margins
    '--variable', 'fontsize=11pt',
    '--variable', 'linkcolor=secondarycolor', // Match our template color
    '--variable', 'urlcolor=secondarycolor',  // Match our template color
    '--variable', 'CJKmainfont=Hiragino Sans GB',  // For any CJK characters
    '--metadata', 'title=Ontwikkelingsproject – Uitgebreid Aanvraagdocument van markov',
    '--metadata', 'author=Olivier Debeuf De Rijcker',
    '--metadata', 'date=2025-01-01',
    '--standalone',
    '--dpi=300',  // Higher resolution for images
    '--wrap=none', // Better list handling
    '-f', 'markdown+smart+raw_tex+tex_math_single_backslash' // Extended markdown features
  ];

  console.log('Starting pandoc conversion with LaTeX...');
  console.log(`Command: pandoc ${pandocArgs.join(' ')}`);

  return new Promise((resolve, reject) => {
    const pandocProcess = spawn('pandoc', pandocArgs);
    
    let stdout = '';
    let stderr = '';
    
    pandocProcess.stdout.on('data', (data) => {
      stdout += data.toString();
      console.log(data.toString());
    });
    
    pandocProcess.stderr.on('data', (data) => {
      stderr += data.toString();
      console.error(data.toString());
    });
    
    pandocProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`Conversion successful. PDF saved to: ${outputPath}`);
        resolve(stdout);
      } else {
        console.error(`Error: Pandoc exited with code ${code}`);
        console.error(`Error output: ${stderr}`);
        reject(new Error(`Pandoc failed with code ${code}`));
      }
      
      // Clean up template file
      fs.unlinkSync(texTemplatePath);
    });
  });
}

// Run the conversion
runPandoc().catch(error => {
  console.error(`Failed to convert document: ${error.message}`);
  process.exit(1);
});